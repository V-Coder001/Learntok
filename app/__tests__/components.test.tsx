import { fireEvent, render } from '@testing-library/react-native';

import { Button } from '@/components/Button';
import { SegmentControl } from '@/components/SegmentControl';

describe('Button', () => {
  it.skip('ruft onPress auf', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Weiter" onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Weiter' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.skip('ist im Ladezustand nicht drückbar', () => {
    const onPress = jest.fn();
    const { getByRole } = render(<Button label="Kaufen" loading onPress={onPress} />);
    fireEvent.press(getByRole('button', { name: 'Kaufen' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('SegmentControl', () => {
  it.skip('meldet die gewählte Option', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <SegmentControl
        options={[
          { value: 'private', label: 'Privat' },
          { value: 'group', label: 'Gruppe' },
        ]}
        value="private"
        onChange={onChange}
      />,
    );
    fireEvent.press(getByRole('tab', { name: 'Gruppe' }));
    expect(onChange).toHaveBeenCalledWith('group');
  });
});
