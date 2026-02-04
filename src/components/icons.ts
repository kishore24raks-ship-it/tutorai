import { BrainCircuit } from 'lucide-react';
import React, { type SVGProps } from 'react';

export const Icons = {
  logo: BrainCircuit,
  Futbol: (props: SVGProps<SVGSVGElement>) =>
    React.createElement(
      'svg',
      {
        ...props,
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
      React.createElement('path', { d: 'M12 18a2.5 2.5 0 0 0-2.5 2.5' }),
      React.createElement('path', { d: 'M12 18a2.5 2.5 0 0 1 2.5 2.5' }),
      React.createElement('path', { d: 'M12 6a2.5 2.5 0 0 0-2.5-2.5' }),
      React.createElement('path', { d: 'M12 6a2.5 2.5 0 0 1 2.5-2.5' }),
      React.createElement('path', { d: 'm4.9 8.2-.8 3.5' }),
      React.createElement('path', { d: 'm19.1 8.2.8 3.5' }),
      React.createElement('path', { d: 'm4.9 15.8-.8-3.5' }),
      React.createElement('path', { d: 'm19.1 15.8.8-3.5' }),
      React.createElement('path', { d: 'M9.4 3.5a2.5 2.5 0 0 0-2.2 1.3' }),
      React.createElement('path', { d: 'M14.6 3.5a2.5 2.5 0 0 1 2.2 1.3' }),
      React.createElement('path', { d: 'M9.4 20.5a2.5 2.5 0 0 1-2.2-1.3' }),
      React.createElement('path', { d: 'M14.6 20.5a2.5 2.5 0 0 0 2.2-1.3' })
    ),
};
