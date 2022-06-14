export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  notchCount?: number;
  notchLabels?: string[];
  notchTicksVisible?: boolean;
  showValue?: boolean;
  resetValue?: number;
  disabled?: boolean;
  editableValue?: boolean;
  validValues?: 'steps' | 'range' | ((value: number) => boolean);
  valueSuffix?: string;
  minimumDpadGranularity?: number;
  onChange?(value: number): void;
}

export function SliderControl(props: SliderProps) {
  return (
    <div class="gamepadslider_SliderControl_3o137">
      <div class="gamepadslider_SliderTrack_Mq25N gamepadslider_SliderHasNotches_2XiAy"></div>
      <div class="gamepadslider_SliderHandleContainer_1pQZi">
        <div id="Handle" class="gamepadslider_SliderHandle_2yVKj"></div>
      </div>
    </div>
  );
}
