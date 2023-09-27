const whitelist = [
  'http://localhost:5173',
  'http://localhost:8081',
  'https://zippy-starlight-26ce2f.netlify.app',
  'https://tourmaline-tarsier-9d8be3.netlify.app',
  'https://lnu-ilms.onrender.com',
  'https://lnu-ilms.netlify.app',
  'http://lnu-ilms.online'
];

const corsOption = {
  origin: function (origin: any, callback: (arg0: any, arg1: any) => void) {
    if (!origin || whitelist.indexOf(origin as string) !== -1) {
      callback(null, true);
      // console.log(origin, 'is allowed by CORS');
    } else {
      console.log(origin, 'is block by CORS');
    }
  },
  credentials: true,
};

export default corsOption;
