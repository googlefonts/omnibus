import $ from 'jquery';

const styleClasses = ['u-fs-italic', 'u-fs-normal'];
const caseClasses = ['u-tt-uppercase', 'u-tt-lowercase'];

function setRandomClass() {
  $('.js-faustina__header span').each(function applyClass() {
    $(this).removeClass();
    $(this).addClass(styleClasses[~~(Math.random() * styleClasses.length)]);
    $(this).addClass(caseClasses[~~(Math.random() * caseClasses.length)]);
  });
}

setInterval(function loop() {
  setRandomClass();
}, 2000);

export default setRandomClass;
