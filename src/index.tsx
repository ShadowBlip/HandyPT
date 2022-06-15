import { render } from 'preact';
import { SMM } from './types/SMM';
import { PowerTools } from './util';
import { App } from './view';

const PLUGIN_ID = 'handy-pt';
const TITLE = 'Handheld Power Tools';

export const load = (smm: SMM) => {
  console.info(`${TITLE} plugin loaded!`);

  const pt = new PowerTools(smm);

  // Add quickaccess menu
  smm.InGameMenu.addMenuItem({
    id: PLUGIN_ID,
    title: TITLE,
    render: async (smm: SMM, root: HTMLElement) =>
      render(<App smm={smm} tools={pt} />, root),
  });
};

export const unload = (smm: SMM) => {
  console.info(`${TITLE} plugin unloaded!`);
  smm.InGameMenu.removeMenuItem(PLUGIN_ID);
};
