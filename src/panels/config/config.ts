const swv = 'sw-visibility';
const expt = 'export-template';
const osm = 'open-sm';
const otm = 'open-tm';
const ola = 'open-layers';
const obl = 'open-blocks';
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
  defaults: { id: string; appendTo?: string; buttons: btnT[] }[];
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
          className: 'fa fa-square-o',
          command: swv,
          context: swv,
          attributes: { title: 'View frame line' },
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
        //   id: expt,
        //   className: 'fa fa-code',
        //   command: expt,
        //   attributes: { title: 'View code' },
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
