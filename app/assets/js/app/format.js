import $ from './jquery-shim.js';

const buildFormat = function() {
  var $toc = $('<div />', {id: 'toc_container'});
  var $list = $('<ul />', {class: 'toc_list'});
  var $groups = $('.u-format-group');
  if ( $groups.length === 0 ){
    return false;
  }
  // フォーマットグループごとの処理
  for (var i = 0; i < $groups.length; i++) {
    var $_list = $('<ul />');
    var $group = $($groups[i]);
    var group_title = $group.find('.u-format-group__title').text();
    var $group_li = $('<li />');
    var groupid = 'formatgroup_' + (i + 1);
    $group.attr('id', groupid);
    $list.append(
      $group_li.append(
        $('<a />',
          {
            text: (i + 1) + '. ' + group_title,
            href: '#' + groupid
          }
        )
      )
    );
    // フォーマットごとの処理
    var $formats = $group.find('.u-format-group__content').find('.u-format');
    var $_ul = $('<ul />');
    for (var m = 0; m < $formats.length; m++) {
      var $format = $($formats[m]);
      var $format_title = $format.find('.u-format__title');
      var $format_content = $format.find('.u-format__content');
      var formatid = 'format_' + (i + 1) + (m + 1);
      $format.find('.u-format__title').attr('id', formatid);
      var format_title = $format_title.text();
      var format_number = (i + 1) + '.' + (m + 1) + '. ';
      $format_title.text(format_number + format_title);
      $_ul.append(
        $('<li />').append(
          $('<a />', {
              href: '#' + formatid,
              text: format_number + format_title
            }
          )
        )
      );

      // コードを追加
      var $code = $('<div />', {class: 'u-format__code'});
      $code.append($('<div />', {
        class: 'u-format__code__title',
        text: format_number + format_title
      }));
      var formathtml = $format.find('.u-format__content').html();
      $code.append($('<pre />', {text: formathtml.trim()}));
      $format.append($code);
    }
    $group_li.append($_ul);
    $_list.append($group_li);
    $list.append($_list);
  }
  $toc.append($list);
  $('.c-breadcrumb').after(
    $('<div />', {
        class: 'l-container'
      }
    ).append($toc)
  );
}

export default buildFormat;
