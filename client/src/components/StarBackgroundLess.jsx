import React from "react";
import styled from "styled-components";

const StarBackground = props =>(
<StarStyled>

    <div className="stars">
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
  <div className="container">
    <div className="star"></div>
  </div>
</div>

</StarStyled>


);

export default StarBackground;

const StarStyled = styled.div`
.stars .container {
  position: fixed;
  z-index: -10;
  animation: stars linear infinite;
}
.stars .container .star {
  animation: twinkle linear infinite;
  border-radius: 100%;
  transform: translateZ(0);
}
.stars .container:nth-child(0) {
  width: 2px;
  height: 2px;
  left: 66vw;
  animation-delay: -996.1s;
  animation-duration: 23s;
}
.stars .container:nth-child(0) .star {
  width: inherit;
  height: inherit;
  animation-delay: -42s;
  animation-duration: 29.6s;
  background: #ec9972;
}
.stars .container:nth-child(1) {
  width: 1px;
  height: 1px;
  left: 0vw;
  animation-delay: -994.2s;
  animation-duration: 146.2s;
}
.stars .container:nth-child(1) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.2s;
  animation-duration: 80.4s;
  background: #d9fce8;
}
.stars .container:nth-child(2) {
  width: 1px;
  height: 1px;
  left: 44.5vw;
  animation-delay: -984.8s;
  animation-duration: 75.6s;
}
.stars .container:nth-child(2) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.1s;
  animation-duration: 80.4s;
  background: rgba(243,155,168,0.8);
}
.stars .container:nth-child(3) {
  width: 2px;
  height: 2px;
  left: 26.5vw;
  animation-delay: -997.9s;
  animation-duration: 179.8s;
}
.stars .container:nth-child(3) .star {
  width: inherit;
  height: inherit;
  animation-delay: -47.7s;
  animation-duration: 80.8s;
  background: #e7f168;
}
.stars .container:nth-child(4) {
  width: 1px;
  height: 1px;
  left: 18.5vw;
  animation-delay: -987s;
  animation-duration: 216s;
}
.stars .container:nth-child(4) .star {
  width: inherit;
  height: inherit;
  animation-delay: -41.3s;
  animation-duration: 80.5s;
  background: rgba(238,186,184,0.9);
}
.stars .container:nth-child(5) {
  width: 3px;
  height: 3px;
  left: 86.5vw;
  animation-delay: -999.3333333333334s;
  animation-duration: 23.066666666666666s;
}
.stars .container:nth-child(5) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.8s;
  animation-duration: 43.3s;
  background: #fbde6c;
}
.stars .container:nth-child(6) {
  width: 2px;
  height: 2px;
  left: 97vw;
  animation-delay: -998.9s;
  animation-duration: 126s;
}
.stars .container:nth-child(6) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.2s;
  animation-duration: 32.3s;
  background: rgba(209,152,209,0.7);
}
.stars .container:nth-child(7) {
  width: 2px;
  height: 2px;
  left: 21vw;
  animation-delay: -993.7s;
  animation-duration: 185.9s;
}
.stars .container:nth-child(7) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.8s;
  animation-duration: 80.1s;
  background: #e0aeba;
}
.stars .container:nth-child(8) {
  width: 1px;
  height: 1px;
  left: 87.5vw;
  animation-delay: -992.2s;
  animation-duration: 87.4s;
}
.stars .container:nth-child(8) .star {
  width: inherit;
  height: inherit;
  animation-delay: -48.9s;
  animation-duration: 70.8s;
  background: rgba(209,182,171,0.8);
}
.stars .container:nth-child(9) {
  width: 2px;
  height: 2px;
  left: 27.5vw;
  animation-delay: -999.7s;
  animation-duration: 79.8s;
}
.stars .container:nth-child(9) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.1s;
  animation-duration: 70.1s;
  background: rgba(230,238,205,0.7);
}
.stars .container:nth-child(10) {
  width: 1px;
  height: 1px;
  left: 59vw;
  animation-delay: -993.8s;
  animation-duration: 128.4s;
}
.stars .container:nth-child(10) .star {
  width: inherit;
  height: inherit;
  animation-delay: -43.8s;
  animation-duration: 11.2s;
  background: #ccbc7e;
}
.stars .container:nth-child(11) {
  width: 1px;
  height: 1px;
  left: 39vw;
  animation-delay: -985s;
  animation-duration: 282.8s;
}
.stars .container:nth-child(11) .star {
  width: inherit;
  height: inherit;
  animation-delay: -43.7s;
  animation-duration: 75s;
  background: #d8fb6a;
}
.stars .container:nth-child(12) {
  width: 3px;
  height: 3px;
  left: 70.5vw;
  animation-delay: -996.4s;
  animation-duration: 75s;
}
.stars .container:nth-child(12) .star {
  width: inherit;
  height: inherit;
  animation-delay: -49.8s;
  animation-duration: 46s;
  background: #dee0e3;
}
.stars .container:nth-child(13) {
  width: 1px;
  height: 1px;
  left: 39vw;
  animation-delay: -991.6s;
  animation-duration: 362s;
}
.stars .container:nth-child(13) .star {
  width: inherit;
  height: inherit;
  animation-delay: -42.8s;
  animation-duration: 49.5s;
  background: rgba(249,236,232,0.8);
}
.stars .container:nth-child(14) {
  width: 2px;
  height: 2px;
  left: 14.5vw;
  animation-delay: -997.1s;
  animation-duration: 74.6s;
}
.stars .container:nth-child(14) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.3s;
  animation-duration: 49.9s;
  background: rgba(252,169,188,0.9);
}
.stars .container:nth-child(15) {
  width: 2px;
  height: 2px;
  left: 45.5vw;
  animation-delay: -990.8s;
  animation-duration: 96.1s;
}
.stars .container:nth-child(15) .star {
  width: inherit;
  height: inherit;
  animation-delay: -47s;
  animation-duration: 20.9s;
  background: rgba(219,168,249,0.8);
}
.stars .container:nth-child(16) {
  width: 1px;
  height: 1px;
  left: 15vw;
  animation-delay: -995.2s;
  animation-duration: 323s;
}
.stars .container:nth-child(16) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.9s;
  animation-duration: 59.3s;
  background: #fba4cc;
}
.stars .container:nth-child(17) {
  width: 3px;
  height: 3px;
  left: 91vw;
  animation-delay: -995.3333333333334s;
  animation-duration: 99s;
}
.stars .container:nth-child(17) .star {
  width: inherit;
  height: inherit;
  animation-delay: -47.3s;
  animation-duration: 59.2s;
  background: rgba(213,186,201,0.9);
}
.stars .container:nth-child(18) {
  width: 2px;
  height: 2px;
  left: 64.5vw;
  animation-delay: -993.6s;
  animation-duration: 191.8s;
}
.stars .container:nth-child(18) .star {
  width: inherit;
  height: inherit;
  animation-delay: -43.5s;
  animation-duration: 15.6s;
  background: rgba(254,240,182,0.8);
}
.stars .container:nth-child(19) {
  width: 1px;
  height: 1px;
  left: 31.5vw;
  animation-delay: -994.4s;
  animation-duration: 338.2s;
}
.stars .container:nth-child(19) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.9s;
  animation-duration: 27.9s;
  background: #febe85;
}
.stars .container:nth-child(20) {
  width: 2px;
  height: 2px;
  left: 25.5vw;
  animation-delay: -998.4s;
  animation-duration: 173.6s;
}
.stars .container:nth-child(20) .star {
  width: inherit;
  height: inherit;
  animation-delay: -43.2s;
  animation-duration: 5.5s;
  background: rgba(204,197,120,0.7);
}
.stars .container:nth-child(21) {
  width: 2px;
  height: 2px;
  left: 54.5vw;
  animation-delay: -993s;
  animation-duration: 93.8s;
}
.stars .container:nth-child(21) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.2s;
  animation-duration: 69.7s;
  background: #dca78d;
}
.stars .container:nth-child(22) {
  width: 2px;
  height: 2px;
  left: 65vw;
  animation-delay: -995.4s;
  animation-duration: 174.1s;
}
.stars .container:nth-child(22) .star {
  width: inherit;
  height: inherit;
  animation-delay: -42.4s;
  animation-duration: 69.2s;
  background: rgba(246,201,252,0.9);
}
.stars .container:nth-child(23) {
  width: 1px;
  height: 1px;
  left: 77.5vw;
  animation-delay: -988.2s;
  animation-duration: 363s;
}
.stars .container:nth-child(23) .star {
  width: inherit;
  height: inherit;
  animation-delay: -41.9s;
  animation-duration: 69.2s;
  background: rgba(229,213,101,0.9);
}
.stars .container:nth-child(24) {
  width: 3px;
  height: 3px;
  left: 10vw;
  animation-delay: -995.4s;
  animation-duration: 92.39999999999999s;
}
.stars .container:nth-child(24) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.1s;
  animation-duration: 69.4s;
  background: rgba(250,172,143,0.8);
}
.stars .container:nth-child(25) {
  width: 2px;
  height: 2px;
  left: 44vw;
  animation-delay: -991.5s;
  animation-duration: 63.3s;
}
.stars .container:nth-child(25) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.2s;
  animation-duration: 80.4s;
  background: rgba(223,186,192,0.9);
}
.stars .container:nth-child(26) {
  width: 3px;
  height: 3px;
  left: 41vw;
  animation-delay: -993.6666666666666s;
  animation-duration: 96.53333333333335s;
}
.stars .container:nth-child(26) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.8s;
  animation-duration: 80;
  background: #d8a7fd;
}
.stars .container:nth-child(27) {
  width: 1px;
  height: 1px;
  left: 40.5vw;
  animation-delay: -984.4s;
  animation-duration: 200.4s;
}
.stars .container:nth-child(27) .star {
  width: inherit;
  height: inherit;
  animation-delay: -45.3s;
  animation-duration: 80.9s;
  background: rgba(254,226,100,0.8);
}
.stars .container:nth-child(28) {
  width: 3px;
  height: 3px;
  left: 73vw;
  animation-delay: -993.8s;
  animation-duration: 112.73333333333333s;
}
.stars .container:nth-child(28) .star {
  width: inherit;
  height: inherit;
  animation-delay: -48.7s;
  animation-duration: 190s;
  background: rgba(247,192,240,0.8);
}
.stars .container:nth-child(29) {
  width: 3px;
  height: 3px;
  left: 26vw;
  animation-delay: -996.3333333333334s;
  animation-duration: 190s;
}
.stars .container:nth-child(29) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.1s;
  animation-duration:90s;
  background: rgba(244,226,215,0.9);
}
.stars .container:nth-child(30) {
  width: 3px;
  height: 3px;
  left: 58.5vw;
  animation-delay: -998.8666666666667s;
  animation-duration: 190s
}
.stars .container:nth-child(30) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.7s;
  animation-duration: 90.8s;
  background: rgba(215,206,135,0.9);
}
.stars .container:nth-child(31) {
  width: 1px;
  height: 1px;
  left: 49.5vw;
  animation-delay: -999.8s;
  animation-duration: 213.6s;
}
.stars .container:nth-child(31) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.1s;
  animation-duration: 90s;
  background: rgba(213,203,141,0.8);
}
.stars .container:nth-child(32) {
  width: 1px;
  height: 1px;
  left: 95vw;
  animation-delay: -995s;
  animation-duration: 210.4s;
}
.stars .container:nth-child(32) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.8s;
  animation-duration: 90s;
  background: rgba(241,196,237,0.8);
}
.stars .container:nth-child(33) {
  width: 1px;
  height: 1px;
  left: 79vw;
  animation-delay: -988s;
  animation-duration: 108.6s;
}
.stars .container:nth-child(33) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.1s;
  animation-duration: 90s;
  background: #d6c7ae;
}
.stars .container:nth-child(34) {
  width: 1px;
  height: 1px;
  left: 42vw;
  animation-delay: -988.4s;
  animation-duration: 137.2s;
}
.stars .container:nth-child(34) .star {
  width: inherit;
  height: inherit;
  animation-delay: -46.4s;
  animation-duration: 90s;
  background: rgba(247,205,185,0.9);
}
.stars .container:nth-child(35) {
  width: 2px;
  height: 2px;
  left: 12vw;
  animation-delay: -992.2s;
  animation-duration: 190s
}
.stars .container:nth-child(35) .star {
  width: inherit;
  height: inherit;
  animation-delay: -42.9s;
  animation-duration: 190s;
  background: #efa26b;
}
.stars .container:nth-child(36) {
  width: 1px;
  height: 1px;
  left: 85vw;
  animation-delay: -995.6s;
  animation-duration: 196.6s;
}
.stars .container:nth-child(36) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.9s;
  animation-duration: 46.6s;
  background: #c99bd8;
}
.stars .container:nth-child(37) {
  width: 2px;
  height: 2px;
  left: 19vw;
  animation-delay: -991.2s;
  animation-duration: 149.1s;
}
.stars .container:nth-child(37) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.3s;
  animation-duration: 90s;
  background: rgba(253,182,208,0.7);
}
.stars .container:nth-child(38) {
  width: 1px;
  height: 1px;
  left: 92.5vw;
  animation-delay: -990.6s;
  animation-duration: 319.2s;
}
.stars .container:nth-child(38) .star {
  width: inherit;
  height: inherit;
  animation-delay: -44.4s;
  animation-duration: 190s;
  background: #c9a266;
}
.stars .container:nth-child(39) {
  width: 3px;
  height: 3px;
  left: 3vw;
  animation-delay: -996.6666666666666s;
  animation-duration: 44.800000000000004s;
}
.stars .container:nth-child(39) .star {
  width: inherit;
  height: inherit;
  animation-delay: -46.1s;
  animation-duration: 190s;
  background: rgba(236,251,125,0.8);
}
.stars .container:nth-child(40) {
  width: 3px;
  height: 3px;
  left: 54vw;
  animation-delay: -998.1333333333333s;
  animation-duration: 190s
}
.stars .container:nth-child(40) .star {
  width: inherit;
  height: inherit;
  animation-delay: -48.5s;
  animation-duration: 190s;
  background: rgba(240,163,194,0.7);
}
.stars .container:nth-child(41) {
  width: 3px;
  height: 3px;
  left: 20.5vw;
  animation-delay: -999.1333333333333s;
  animation-duration: 47.199999999999996s;
}
.stars .container:nth-child(41) .star {
  width: inherit;
  height: inherit;
  animation-delay: -40.8s;
  animation-duration: 190s;
  background: rgba(227,255,136,0.7);
}
@-moz-keyframes stars {
  0% {
    transform: translateY(110vh) translateZ(0);
  }
  100% {
    transform: translateY(-10vh) translateZ(0);
  }
}
@-webkit-keyframes stars {
  0% {
    transform: translateY(110vh) translateZ(0);
  }
  100% {
    transform: translateY(-10vh) translateZ(0);
  }
}
@-o-keyframes stars {
  0% {
    transform: translateY(110vh) translateZ(0);
  }
  100% {
    transform: translateY(-10vh) translateZ(0);
  }
}
@keyframes stars {
  0% {
    transform: translateY(110vh) translateZ(0);
  }
  100% {
    transform: translateY(-10vh) translateZ(0);
  }
}
@-moz-keyframes twinkle {
  0%, 80%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 0 #fff, 0 0 0 #fff;
  }
  95% {
    opacity: 1;
    box-shadow: 0 0 2px #fff, 0 0 4px #fff;
  }
}
@-webkit-keyframes twinkle {
  0%, 80%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 0 #fff, 0 0 0 #fff;
  }
  95% {
    opacity: 1;
    box-shadow: 0 0 2px #fff, 0 0 4px #fff;
  }
}
@-o-keyframes twinkle {
  0%, 80%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 0 #fff, 0 0 0 #fff;
  }
  95% {
    opacity: 1;
    box-shadow: 0 0 2px #fff, 0 0 4px #fff;
  }
}
@keyframes twinkle {
  0%, 80%, 100% {
    opacity: 0.7;
    box-shadow: 0 0 0 #fff, 0 0 0 #fff;
  }
  95% {
    opacity: 1;
    box-shadow: 0 0 2px #fff, 0 0 4px #fff;
  }
}

`;