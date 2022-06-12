// TODO: this will have proper types once a types package is available
type SMM = any;

export const load = (smm: SMM) => {
  console.info('Template plugin loaded!');
};

export const unload = () => {
  console.info('Template plugin unloaded!');
}