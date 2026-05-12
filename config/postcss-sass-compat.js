const postcss = require('postcss');

const breakpoints = {
  small: 0,
  medium: 750,
  large: 950,
  xlarge: 1140,
  xxlarge: 1440,
};

const breakpointOrder = Object.keys(breakpoints);

const stripQuotes = (value) => value.replace(/^['"]|['"]$/g, '');

const splitArgs = (value) => {
  const args = [];
  let current = '';
  let depth = 0;

  for (const char of value) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;

    if (char === ',' && depth === 0) {
      args.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) args.push(current.trim());
  return args;
};

const numberValue = (value) => {
  const match = String(value).trim().match(/^(-?\d*\.?\d+)([a-z%]*)$/i);
  if (!match) return null;
  return {
    number: Number(match[1]),
    unit: match[2] || '',
  };
};

const formatNumber = (value) => {
  const rounded = Math.round((value + Number.EPSILON) * 1000000) / 1000000;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
};

const toEm = (value) => {
  const parsed = numberValue(value);
  if (!parsed) return String(value);
  if (parsed.unit === 'em') return `${formatNumber(parsed.number)}em`;
  if (parsed.unit === 'rem') return `${formatNumber(parsed.number)}em`;
  return `${formatNumber(parsed.number / 16)}em`;
};

const nextBreakpoint = (name) => {
  const index = breakpointOrder.indexOf(name);
  if (index === -1 || index === breakpointOrder.length - 1) return null;
  return breakpoints[breakpointOrder[index + 1]];
};

const breakpointQuery = (params) => {
  const parts = params.trim().split(/\s+/);
  const key = parts[0] || 'small';
  const dir = parts[1] || 'up';
  const raw = Object.prototype.hasOwnProperty.call(breakpoints, key) ? breakpoints[key] : key;
  const max = Object.prototype.hasOwnProperty.call(breakpoints, key) ? nextBreakpoint(key) : raw;
  const minEm = toEm(`${raw}px`);
  const maxEm = max == null ? null : toEm(`${max}px`);

  if (dir === 'up' && numberValue(raw)?.number === 0) return null;
  if (dir === 'up') return `screen and (width >= ${minEm})`;
  if (dir === 'down') return maxEm ? `screen and (width < ${maxEm})` : null;
  if (dir === 'only') {
    if (numberValue(raw)?.number === 0) return maxEm ? `screen and (width < ${maxEm})` : null;
    return maxEm ? `screen and (${minEm} <= width < ${maxEm})` : null;
  }

  return null;
};

const mapGet = (map, key) => {
  const normalizedKey = stripQuotes(key.trim());

  if (map.includes('$grid-responsive-margin')) {
    return { sm: '16px', md: '32px' }[normalizedKey];
  }

  if (map.includes('$grid-column-responsive-gutter')) {
    return { small: '16px', medium: '36px' }[normalizedKey];
  }

  return undefined;
};

const evaluateSimpleMathDiv = (left, right) => {
  const dividend = numberValue(left);
  const divisor = numberValue(right);
  if (!dividend || !divisor || divisor.number === 0) return null;

  const value = dividend.number / divisor.number;
  const unit = dividend.unit && dividend.unit === divisor.unit ? '' : dividend.unit;
  return `${formatNumber(value)}${unit}`;
};

const hexToRgb = (hex) => {
  const value = hex.replace('#', '').trim();
  const normalized = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value;

  if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;

  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
};

const adjustLightness = (hex, amount) => {
  const rgb = hexToRgb(hex);
  const parsedAmount = numberValue(amount);
  if (!rgb || !parsedAmount) return hex;

  const ratio = parsedAmount.number / 100;
  const next = rgb.map((channel) => {
    const adjusted = ratio >= 0
      ? channel + (255 - channel) * ratio
      : channel * (1 + ratio);
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  });

  return `rgb(${next.join(', ')})`;
};

const replaceInterpolations = (value) => value
  .replace(/#\{\s*([0-9.]+[a-z%]+)\s*\}/gi, '$1')
  .replace(/#\{\s*\$([a-zA-Z0-9_-]+)\s*\*\s*1px\s*\}/g, 'calc($$$1 * 1px)')
  .replace(/#\{\s*map-get\(([^}]+)\)\s*\}/g, 'map-get($1)')
  .replace(/#\{\s*\$([a-zA-Z0-9_-]+)\s*\}/g, '$($1)');

const normalizeValue = (value) => {
  let next = replaceInterpolations(value)
    .replace(/map\.get\(/g, 'map-get(')
    .replace(/color\.adjust\(\s*([^,]+),\s*\$lightness\s*:\s*([^)]+)\)/g, 'sass-color-adjust($1, $2)')
    .replace(/math\.div\(([^,]+),\s*([^)]+)\)/g, 'sass-div($1, $2)');

  next = next.replace(/map-get\(([^,]+),\s*([^)]+)\)/g, (match, map, key) => {
    return mapGet(map, key) || match;
  });

  next = next.replace(/sass-div\(([^,]+),\s*([^)]+)\)(\s*\*\s*100%)?/g, (match, left, right, percent) => {
    const result = evaluateSimpleMathDiv(left, right);
    if (!result) return match;
    if (!percent) return result;

    const parsed = numberValue(result);
    return parsed ? `${formatNumber(parsed.number * 100)}%` : `calc(${result} * 100%)`;
  });

  next = next.replace(/sass-color-adjust\((#[0-9a-fA-F]{3,6}),\s*([^)]+)\)/g, (match, color, amount) => {
    return adjustLightness(color, amount);
  });

  next = next.replace(/rgba\((#[0-9a-fA-F]{3,6}),\s*([^)]+)\)/g, (match, color, alpha) => {
    const rgb = hexToRgb(color);
    return rgb ? `rgba(${rgb.join(', ')}, ${alpha.trim()})` : match;
  });

  return next;
};

const syntaxPlugin = {
  postcssPlugin: 'postcss-sass-compat-syntax',
  Once(root) {
    root.walkAtRules((rule) => {
      if (rule.name === 'use') {
        rule.remove();
        return;
      }

      if (rule.name === 'function') {
        rule.remove();
        return;
      }

      if (rule.name === 'define-mixin') {
        const match = rule.params.match(/^([^{\s(]+)(?:\((.*)\))?$/);
        if (match) {
          const args = match[2] ? ` ${match[2].replace(/\s*,\s*/g, ', ')}` : '';
          rule.params = `${match[1]}${args}`;
        }
        return;
      }

      if (rule.name === 'mixin') {
        const match = rule.params.match(/^([^{\s(]+)(?:\((.*)\))?$/);
        if (match) {
          const args = match[2] ? ` ${match[2].trim()}` : '';
          rule.params = `${match[1]}${args}`.trim();
        }
        return;
      }

      if (rule.name === 'include') {
        const match = rule.params.match(/^([^{\s(]+)(?:\((.*)\))?$/);
        rule.name = 'mixin';
        if (match) {
          const args = match[2] ? ` ${match[2].trim()}` : '';
          rule.params = `${match[1]}${args}`.trim();
        }
        return;
      }

      if (rule.name === 'content') {
        rule.name = 'mixin-content';
      }
    });
  },
};

const mixinPlugin = {
  postcssPlugin: 'postcss-sass-compat-mixins',
  AtRule: {
    mixin(rule) {
      const [name, ...rest] = rule.params.trim().split(/\s+/);
      const params = rest.join(' ');

      if (name === 'breakpoint') {
        const query = breakpointQuery(params);
        if (query) {
          const media = postcss.atRule({ name: 'media', params: query });
          media.append(rule.nodes.map((node) => node.clone()));
          rule.replaceWith(media);
        } else {
          rule.replaceWith(rule.nodes.map((node) => node.clone()));
        }
      }
    },
  },
};

const valuePlugin = {
  postcssPlugin: 'postcss-sass-compat-values',
  Declaration(decl) {
    decl.prop = replaceInterpolations(decl.prop);
    decl.value = normalizeValue(decl.value).replace(/\s+!default\b/g, '');
  },
  Rule(rule) {
    rule.selector = replaceInterpolations(rule.selector);
  },
  AtRule(rule) {
    rule.params = normalizeValue(rule.params);
  },
};

const functions = {
  'strip-unit': (value) => String(value).replace(/^(-?\d*\.?\d+)[a-z%]+$/i, '$1'),
  'to-rem': (value, base = '16px') => {
    const parsedValue = numberValue(value);
    const parsedBase = numberValue(base);
    if (!parsedValue || !parsedBase || parsedValue.unit === 'rem') return value;
    const result = parsedValue.number / parsedBase.number;
    return result === 0 ? '0' : `${formatNumber(result)}rem`;
  },
  'to-em': (value) => toEm(value),
  'rem-calc': (values, base = '16px') => {
    return splitArgs(values).map((value) => functions['to-rem'](value, base)).join(' ');
  },
  'vw-calc': (value, viewport = '1400') => {
    const parsedValue = numberValue(value);
    const parsedViewport = numberValue(viewport);
    if (!parsedValue || !parsedViewport) return value;
    return `${formatNumber((parsedValue.number / parsedViewport.number) * 100)}vw`;
  },
  'cqw-calc': (value, containerWidth = '1400') => {
    const parsedValue = numberValue(value);
    const parsedContainer = numberValue(containerWidth);
    if (!parsedValue || !parsedContainer) return value;
    return `${formatNumber((parsedValue.number / parsedContainer.number) * 100)}cqw`;
  },
  'min-vw': (value, viewport = '1400') => {
    const parsedValue = numberValue(value);
    if (!parsedValue) return value;
    return `min(${formatNumber(parsedValue.number)}px, ${functions['vw-calc'](value, viewport)})`;
  },
  'clamp-vw': (value, min = '10', viewportMax = '2560', viewport = '1400') => {
    const parsedValue = numberValue(value);
    const parsedMax = numberValue(viewportMax);
    const parsedViewport = numberValue(viewport);
    if (!parsedValue || !parsedMax || !parsedViewport) return value;
    return `clamp(${min}px, ${functions['vw-calc'](value, viewport)}, ${formatNumber((parsedValue.number / parsedViewport.number) * parsedMax.number)}px)`;
  },
  'grid-width': (value) => `${formatNumber((Number(value) / 12) * 100)}%`,
};

module.exports = {
  syntaxPlugin,
  mixinPlugin,
  valuePlugin,
  functions,
};
