
import * as jquery from 'jquery';
let windowInstance = (window as { [key: string]: any });
windowInstance['jQuery'] = jquery;
windowInstance['$'] = jquery;