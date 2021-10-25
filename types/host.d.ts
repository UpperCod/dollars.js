export const States: WeakMap<object, any>;
/**
 * @typedef {{prefix:string}} Config
 */
/**
 * create a controller for the state to which dollar will react
 */
export class State {
    constructor(state: any);
    binding: any[];
    $: {
        [x: string]: any;
    };
    /**
     *
     * @param {Object<string,any>} state create the proxy to reflect the state
     * @returns
     */
    init(state: {
        [x: string]: any;
    }): {
        [x: string]: any;
    };
    update(): void;
}
export class Host {
    /**
     *
     * @param {Element} host
     * @param {*} state
     * @param {Config} [config]
     */
    constructor(host: Element, state: any, config?: Config | undefined);
    config: Config;
    /**
     *
     * @param {Element} host
     * @param {{prefix:string,binding:((loop:any)=>void)[],loop:any}} ctx
     */
    template(host: Element, ctx?: {
        prefix: string;
        binding: ((loop: any) => void)[];
        loop: any;
    }): void;
    fn(content: any): (loop: any) => any;
    $on(target: any, type: any, value: any): void;
    $text(target: any, value: any): (loop: any) => any;
    $html(target: any, value: any): (loop: any) => any;
    $show(target: any, value: any): (loop: any) => void;
    $toggle(target: any, type: any, param1: any, param2: any): (loop: any) => any;
    $set(target: any, type: any, content: any): (loop: any) => void;
    /**
     *
     * @param {HTMLTemplateElement} target
     * @param {*} type
     * @param {*} content
     */
    $each(target: HTMLTemplateElement, selector: any): (loop: any) => void;
}
export default $$;
export type Config = {
    prefix: string;
};
/**
 *
 * @param {Element} host
 * @param {*} state
 * @param {Config} config
 * @returns
 */
declare function $$(host: Element, state: any, config: Config): any;
