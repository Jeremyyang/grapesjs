const swv = 'sw-visibility';
// const expt = 'export-code';
const osm = 'open-sm';
const ful = 'fullscreen';
const prv = 'preview';

type btnT =
  | {
      active?: boolean;
      id: string;
      className: string;
      command: string;
      context: string;
      togglable: number;
      attributes: { title: string };
    }
  | {};

export type panelConfigT = {
  stylePrefix: string;
  defaults: {
    id: string;
    appendTo?: string; // dom for postRender
    injectTo?: string; // dom for nextRender or dynamic render
    buttons: btnT[];
  }[];
  em: any;
  delayBtnsShow: number;
};

const panelConfig: panelConfigT = {
  stylePrefix: 'pn-',
  // icon from https://fontawesome.com/v4/icons/
  // Default panels fa-sliders for features
  defaults: [
    // {
    //   id: 'commands',
    //   buttons: [{}],
    // },
    {
      id: 'options',
      appendTo: '.view-btns',
      buttons: [
        {
          active: true,
          id: swv,
          className: 'frame-line-icon',
          command: swv,
          context: swv,
          attributes: { title: 'View frame line' },
          label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M15 5h2V3h-2m0 18h2v-2h-2M11 5h2V3h-2m8 2h2V3h-2m0 6h2V7h-2m0 14h2v-2h-2m0-6h2v-2h-2m0 6h2v-2h-2M3 5h2V3H3m0 6h2V7H3m0 6h2v-2H3m0 6h2v-2H3m0 6h2v-2H3m8 2h2v-2h-2m-4 2h2v-2H7M7 5h2V3H7v2z"></path>
          </svg>`,
        },
        {
          id: ful,
          className: 'fa fa-arrows-alt',
          command: ful,
          context: ful,
          attributes: { title: 'Fullscreen' },
        },
        {
          id: prv,
          className: 'fa fa-eye',
          command: prv,
          context: prv,
          attributes: { title: 'Preview' },
        },
        {
          id: 'undo',
          command: 'core:undo',
          label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z" />
          </svg>`,
          attributes: { title: 'Undo' },
        },
        {
          id: 'redo',
          command: 'core:redo',
          label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10.5 18H18V20H10.5C6.91 20 4 17.09 4 13.5S6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5S8 18 10.5 18Z" />
          </svg>`,
          attributes: { title: 'Redo' },
        },
        {
          id: 'save-page',
          command: 'save-page',
          className: 'fa fa-save',
          attributes: { title: 'Save' },
        },
      ],
    },
    {
      id: 'views',
      appendTo: '.paint-btns',
      buttons: [
        {
          id: osm,
          className: 'fa fa-paint-brush',
          command: osm,
          active: true, // 标记 Style Manager 组件一开始是被开启的
          togglable: 0,
          attributes: { title: 'General setings' },
        },
        {
          id: 'open-tm',
          className: 'fa trait-btn',
          command: 'open-tm',
          active: true,
          label: `<svg style="display: block; max-width:22px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M744.163369 74.965732q-38.280374-19.140187-71.7757-33.495327a337.505296 337.505296 0 0 0-156.311527-41.470405c-97.29595 0-165.88162 55.825545-208.94704 98.890966L271.719756 133.981308l-23.925234 23.925234-35.090343 35.090343-54.230529 54.230529-59.015576 59.015577c-110.056075 110.056075-127.601246 223.302181-57.420561 365.258567q15.950156 33.495327 33.495327 71.775701c63.800623 137.17134 130.791277 280.722741 240.847352 280.722741h9.570093c113.246106-9.570093 145.146417-153.121495 172.261683-282.317757 4.785047-20.735202 7.975078-39.875389 12.760124-57.420561 7.975078-30.305296 22.330218-49.445483 63.800623-89.320872l6.380063-6.380062 3.190031-3.190031 4.785046-4.785047 4.785047-4.785047c41.470405-41.470405 59.015576-55.825545 89.320872-63.800623 17.545171-4.785047 36.685358-7.975078 57.420561-12.760125 127.601246-28.71028 272.747664-60.610592 282.317757-172.261682 9.889097-116.436137-136.852336-185.021807-278.808723-252.012461zM959.490472 319.003115c-6.380062 79.750779-185.021807 103.676012-290.292835 129.196262-46.255452 11.165109-74.965732 36.685358-118.031152 79.750779l-9.570094 9.570093-9.570093 9.570094c-43.065421 43.065421-68.58567 71.775701-79.750779 118.031152-27.115265 105.271028-49.445483 283.912773-129.196262 290.292835h-4.785046c-84.535826 0-154.716511-191.401869-218.517134-317.408099S63.091718 429.05919 144.11851 346.11838l59.015576-59.015576 87.725857-87.725857 59.015576-59.015576c51.040498-51.040498 102.080997-79.750779 162.691589-79.750779a285.986293 285.986293 0 0 1 127.601246 35.090343c129.515265 65.395639 325.702181 137.17134 319.322118 223.30218z m-478.504673 31.900312h63.800623v-63.800623h-63.800623z m0-95.700935h63.800623v-63.800623h-63.800623z m95.700935 0h63.800623v-63.800623h-63.800623z m0 95.700935h63.800623v-63.800623h-63.800623z m-244.037383 191.401869l23.925233-23.925234a30.464798 30.464798 0 0 0-43.06542-43.06542l-23.925234 23.925233-23.925233-23.925233a30.464798 30.464798 0 1 0-43.065421 43.06542l23.925234 23.925234-23.925234 23.925234a30.464798 30.464798 0 1 0 43.065421 43.06542l23.925233-23.925233 25.520249 25.520249a29.029283 29.029283 0 0 0 43.065421 0 31.900312 31.900312 0 0 0 0-43.065421z" p-id="2783"></path>
          </svg>`,
          togglable: 0,
          attributes: { title: 'Traits settings' },
        },
      ],
    },
  ],

  // Editor model
  em: null,

  // Delay before show children buttons (in milliseconds)
  delayBtnsShow: 300,
};

export default panelConfig;
