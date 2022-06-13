import { SMM } from './types/SMM';

export const load = (smm: SMM) => {
  console.info('Template plugin loaded!');

  const render = async () => {
    const modal = (
      <div className="smm-example-modal">
        <h1>Hello World!</h1>
        <div>Woo!</div>
      </div>
    );
    return modal;
  };

  smm.MenuManager.addMenuItem({
    id: 'example',
    label:
      // TODO: attach this to SMM
      (window as any).smmUIMode === 'deck' ? 'Hello World' : 'Hello World',
    fontSize: 16,
    render: async (_smm, root) => {
      root.appendChild(await render());
    },
  });
};

export const unload = (smm: SMM) => {
  console.info('Template plugin unloaded!');
  smm.MenuManager.removeMenuItem('example');
};
