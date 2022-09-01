import Utils from './app/utils.js';
import Accordion from './app/accordion.js';
import Anchor from './app/anchor.js';
import FixedHeader from './app/fixedheader.js';
import HeightLine from './app/heightline.js';
import CopyRight from './app/copyright.js';
import ResponsiveTable from './app/responsive-table.js';
import Slidebar from './app/slidebar.js';
import Tab from './app/tab.js';
import ScrollSpy from './app/scroll-spy.js';
import CurrentNav from './app/current-nav.js';
import buildFormat from './app/format.js';
import myScript from './scripts.js';
import OwlCarousel from "./app/owl-carousel.js";
import SlickSlider from "./app/slick-slider";
import modaal from 'modaal';
import CustomFunctions from "./app/custom";
import modal from './app/modal.js';
import GsapAnimation from "./app/gsap";
import anime from 'animejs';
import modaalCss from 'modaal/dist/css/modaal.css';

class App {
  constructor() {
    this.Utils = new Utils();
    this.Accordion = new Accordion();
    this.Anchor = new Anchor();
    this.FixedHeader = new FixedHeader();
    this.modal = new modal();
    this.CopyRight = new CopyRight();
    this.HeightLine = new HeightLine();
    this.ResponsiveTable = new ResponsiveTable();
    this.Slidebar = new Slidebar();
    this.ScrollSpy = new ScrollSpy();
    this.CurrentNav = new CurrentNav();
    this.Tab = new Tab();
    this.gsap = new GsapAnimation();
    this.defaultOptions = {
      gsap: this.gsap,
      utils: this.Utils
    }
    // 上記のオプション以外で必要な要素は追加する。
    new OwlCarousel({...this.defaultOptions});
    new SlickSlider({...this.defaultOptions});
    new CustomFunctions({...this.defaultOptions});
  }
}

window.GApp = new App();
