import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from '@/components/Button';
import { SegmentControl } from '@/components/SegmentControl';

describe('Button', () => {
  it('ruft onPress auf', () => {
    const onPress = jest.fn();
    render(<Button label="Weiter" onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Weiter' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ist im Ladezustand nicht drückbar', () => {
    const onPress = jest.fn();
    render(<Button label="Kaufen" loading onPress={onPress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Kaufen' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('SegmentControl', () => {
  it('meldet die gewählte Option', () => {
    const onChange = jest.fn();
    render(
      <SegmentControl
        options={[
          { value: 'private', label: 'Privat' },
          { value: 'group', label: 'Gruppe' },
        ]}
        value="private"
        onChange={onChange}
      />,
    );
    fireEvent.press(screen.getByRole('tab', { name: 'Gruppe' }));
    expect(onChange).toHaveBeenCalledWith('group');
  });
});
