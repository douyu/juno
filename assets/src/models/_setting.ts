import defaultSettings, { DefaultSettings } from '../../config/defaultSettings';
import { Reducer } from '@@/plugin-dva/connect';

export interface SettingModelType {
  namespace: '_settings';
  state: DefaultSettings;
  reducers: {
    changeSetting: Reducer<DefaultSettings>;
  };
}

const updateColorWeak: (colorWeak: boolean) => void = (colorWeak) => {
  const root = document.getElementById('root');
  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel: SettingModelType = {
  namespace: '_settings',
  state: defaultSettings,
  reducers: {
    changeSetting(state = defaultSettings, { payload }) {
      const { colorWeak, contentWidth } = payload;

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
      updateColorWeak(!!colorWeak);
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default SettingModel;
