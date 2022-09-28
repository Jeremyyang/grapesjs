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
        // {
        //   id: 'undo',
        //   command: 'core:undo',
        //   label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        //       <path fill="currentColor" d="M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z" />
        //   </svg>`
        // },{
        //   id: 'redo',
        //   command: 'core:redo',
        //   label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        //       <path fill="currentColor" d="M10.5 18H18V20H10.5C6.91 20 4 17.09 4 13.5S6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5S8 18 10.5 18Z" />
        //   </svg>`,
        // },
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
          active: true,
          togglable: 0,
          attributes: { title: 'Open Style Manager' },
        },
        // {
        //   id: otm,
        //   className: 'fa fa-cog',
        //   command: otm,
        //   togglable: 0,
        //   attributes: { title: 'Settings' },
        // },
        // {
        //   id: ola,
        //   className: 'layer-tree',
        //   command: ola,
        //   label: `<svg style="display: block; max-width:22px" viewBox="0 0 24 24">
        //     <path fill="currentColor" d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z"></path>
        //   </svg>`,
        //   togglable: 0,
        //   attributes: { title: 'Open Layer Manager' },
        // },
        // {
        //   id: obl,
        //   className: 'plus-btn',
        //   label: `<svg style="display: block; max-width:22px" viewBox="0 0 24 24">
        //     <path fill="currentColor" d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"></path>
        //   </svg>`,
        //   command: obl,
        //   togglable: 0,
        //   attributes: { title: 'Open Blocks' },
        // },
      ],
    },
  ],

  // Editor model
  em: null,

  // Delay before show children buttons (in milliseconds)
  delayBtnsShow: 300,
};

export default panelConfig;
