"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pdftohtmljs_1 = __importDefault(require("pdftohtmljs"));
// See presets (ipad, default)
// Feel free to create custom presets
// see https://github.com/fagbokforlaget/pdftohtmljs/blob/master/lib/presets/ipad.js
const convert = (file, output, preset) => __awaiter(void 0, void 0, void 0, function* () {
    const converter = new pdftohtmljs_1.default(file, output);
    // If you would like to tap into progress then create
    // progress handler
    converter.progress((ret) => {
        const progress = (ret.current * 100.0) / ret.total;
        console.log(`${progress} %`);
    });
    try {
        // convert() returns promise
        yield converter.convert(preset || 'ipad');
    }
    catch (err) {
        console.error(`Psst! something went wrong: ${err.msg}`);
    }
});
// call method
convert('MasterCard%20Statement-0242%202023-04-13.pdf', 'sample.html', null);
