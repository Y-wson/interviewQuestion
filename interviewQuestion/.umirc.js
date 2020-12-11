// ref: https://umijs.org/config/
import path from 'path';

export default {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        {
          path: '/',
          component: '../pages/js/Js',
        },
      ],
    },
  ],
  proxy: {
    '/api/*': {
      target: 'http://139.224.54.46:7001/api',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    },
    '/public/uploads/*': {
      target: 'http://139.224.54.46:7001/',
      changeOrigin: true,
    },
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'interviewQuestion',
        dll: false,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};
