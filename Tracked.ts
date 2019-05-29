import * as React from 'react';
import memoize from 'memoizee';

export function trackedMemoize(func: Function, options?: any): Function {
    let lastArgs: any = [];
    return memoize((...args) => {
        detectChangedProperty(
            func.name || func.toString().substring(0, (func.toString().indexOf(')') + 1) || 100),
            lastArgs,
            args,
            'param with index'
        );
        lastArgs = args;
        return func(...args);
    }, options);
}

export function detectChangedProperty<T>(name: string, prev: T, current: T, itemName: string): void {
    for (const key in current) {
        if (current.hasOwnProperty(key)) {
            if (current[key] !== prev[key]) {
                try {
                    const sprev = JSON.stringify(prev[key]);
                    const scurrent = JSON.stringify(current[key]);
                    console.warn(`${itemName} ${key} changed in ${name}${sprev === scurrent ? ', but semantically same (probably just NEW OBJECT, check memoization)' : ''}`);
                    console.log(sprev);
                    console.log(scurrent);
                }
                catch {
                    console.warn(`${itemName} ${key} changed in ${name}`);
                    console.log(prev[key]);
                    console.log(current[key]);
                }
            }
        }
    }
}

export class TrackedComponent<T, S = {}> extends React.Component<T, S> {
    componentDidUpdate(prevProps: T) {
        detectChangedProperty(this.constructor.name, prevProps, this.props, 'prop');
    }
}

export class TrackedPureComponent<T, S = {}> extends React.PureComponent<T, S> {
    componentDidUpdate(prevProps: T) {
        detectChangedProperty(this.constructor.name, prevProps, this.props, 'prop');
    }
}
