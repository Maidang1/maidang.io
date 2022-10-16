import {
  defineConfig,
  presetAttributify,
  presetTypography,
  presetUno,
} from 'unocss';
import transformerDirective from '@unocss/transformer-directives';
export default defineConfig({
  presets: [
    presetAttributify(), // required if using attributify mode
    presetUno(), // required
    presetTypography(),
  ],
  transformers: [transformerDirective()],
});
