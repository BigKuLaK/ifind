import { BrowserRouter } from 'react-router-dom';

// import '../public/css/magnific-popup.min.css';
// import '../public/css/jquery.fancybox.min.css';
// import '../public/css/niceselect.css';
// import '../public/css/animate.css';
// import '../public/css/flex-slider.min.css';
// import '../public/css/owl-carousel.css';
// import '../public/css/slicknav.min.css';
import '../public/css/font-awesome.css';
import '../public/css/themify-icons.css';
import '../public/css/reset.css';

import '../src/App.scss';
import '../src/sb/styles.scss';

import { spriteContents } from 'ifind-icons';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (Story) => (
    <BrowserRouter>
      <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>
      <Story />
    </BrowserRouter>
  ),
];