//Material Icons
import "../scss/font.scss";



import Utils from './app/utils.js';
import Accordion from './app/accordion.js';
import Anchor from './app/anchor.js';
import FixedHeader from './app/fixedheader.js';
// import HeightLine from './app/heightline.js';
import CopyRight from './app/copyright.js';
import Slidebar from './app/slidebar.js';
import Tab from './app/tab.js';
// import ScrollSpy from './app/scroll-spy.js';
import CurrentNav from './app/current-nav.js';
import myScript from './scripts.js';
import SwiperSlider from "./app/swiper.js";
// import modaal from 'modaal';
import CustomFunctions from "./app/custom";
import modal from './app/modal.js';
import GsapAnimation from "./app/gsap";
// import modaalCss from 'modaal/dist/css/modaal.css';
import Scrollable from "./app/scrollable";
import Dropdown from "./app/dropdown";
import DropdownTextSync from "./app/dropdown-text-sync";
import InfiniteSlider from "./app/infinite-slider";
// import Parallax from "./app/parallax";
// import LenisScroll from "./app/lenis";

class App {
  constructor() {
    this.Utils = new Utils();
    this.Dropdown = new Dropdown();
    this.DropdownTextSync = new DropdownTextSync();
    this.Accordion = new Accordion();
    this.Anchor = new Anchor();
    this.FixedHeader = new FixedHeader();
    this.modal = new modal();
    this.CopyRight = new CopyRight();
    // this.HeightLine = new HeightLine();
    this.Slidebar = new Slidebar();
    // this.ScrollSpy = new ScrollSpy();
    this.CurrentNav = new CurrentNav();
    this.Tab = new Tab();
    this.gsap = new GsapAnimation();
    this.Scrollable = new Scrollable();
    this.InfiniteSlider = new InfiniteSlider();
    // this.parallax = new Parallax();
    // this.lenis = new LenisScroll();
    this.defaultOptions = {
      gsap: this.gsap,
      utils: this.Utils
    }
    // 上記のオプション以外で必要な要素は追加する。
    new SwiperSlider({...this.defaultOptions});
    new CustomFunctions({...this.defaultOptions});
  }
}

window.GApp = new App();
