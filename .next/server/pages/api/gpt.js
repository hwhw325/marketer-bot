"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/gpt";
exports.ids = ["pages/api/gpt"];
exports.modules = {

/***/ "openai":
/*!*************************!*\
  !*** external "openai" ***!
  \*************************/
/***/ ((module) => {

module.exports = import("openai");;

/***/ }),

/***/ "(api)/./pages/api/gpt.ts":
/*!**************************!*\
  !*** ./pages/api/gpt.ts ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openai */ \"openai\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([openai__WEBPACK_IMPORTED_MODULE_0__]);\nopenai__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nconst openai = new openai__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n    apiKey: process.env.OPENAI_API_KEY\n});\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            error: \"허용되지 않은 요청입니다.\"\n        });\n    }\n    const { prompt } = req.body;\n    if (!prompt) {\n        return res.status(400).json({\n            error: \"프롬프트가 없습니다.\"\n        });\n    }\n    try {\n        const completion = await openai.chat.completions.create({\n            model: \"gpt-3.5-turbo\",\n            messages: [\n                {\n                    role: \"user\",\n                    content: prompt\n                }\n            ],\n            temperature: 0.7\n        });\n        const result = completion.choices?.[0]?.message?.content?.trim() || \"\";\n        res.status(200).json({\n            result\n        });\n    } catch (error) {\n        console.error(\"OpenAI API 오류:\", error);\n        res.status(500).json({\n            error: \"문구 생성 중 오류가 발생했어요.\"\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ3B0LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQzRCO0FBRTVCLE1BQU1DLFNBQVMsSUFBSUQsOENBQU1BLENBQUM7SUFDeEJFLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsY0FBYztBQUNwQztBQUVlLGVBQWVDLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CO0lBQzdFLElBQUlELElBQUlFLE1BQU0sS0FBSyxRQUFRO1FBQ3pCLE9BQU9ELElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFpQjtJQUN4RDtJQUVBLE1BQU0sRUFBRUMsTUFBTSxFQUFFLEdBQUdOLElBQUlPLElBQUk7SUFFM0IsSUFBSSxDQUFDRCxRQUFRO1FBQ1gsT0FBT0wsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQWM7SUFDckQ7SUFFQSxJQUFJO1FBQ0YsTUFBTUcsYUFBYSxNQUFNZCxPQUFPZSxJQUFJLENBQUNDLFdBQVcsQ0FBQ0MsTUFBTSxDQUFDO1lBQ3REQyxPQUFPO1lBQ1BDLFVBQVU7Z0JBQUM7b0JBQUVDLE1BQU07b0JBQVFDLFNBQVNUO2dCQUFPO2FBQUU7WUFDN0NVLGFBQWE7UUFDZjtRQUVBLE1BQU1DLFNBQVNULFdBQVdVLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRUMsU0FBU0osU0FBU0ssVUFBVTtRQUNwRW5CLElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRWE7UUFBTztJQUNoQyxFQUFFLE9BQU9aLE9BQU87UUFDZGdCLFFBQVFoQixLQUFLLENBQUMsa0JBQWtCQTtRQUNoQ0osSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXFCO0lBQ3JEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXJrZXRlci1ib3QvLi9wYWdlcy9hcGkvZ3B0LnRzPzRkZDMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnO1xuaW1wb3J0IE9wZW5BSSBmcm9tICdvcGVuYWknO1xuXG5jb25zdCBvcGVuYWkgPSBuZXcgT3BlbkFJKHtcbiAgYXBpS2V5OiBwcm9jZXNzLmVudi5PUEVOQUlfQVBJX0tFWSwgLy8gLmVudi5sb2NhbOyXkCBPUEVOQUlfQVBJX0tFWeqwgCDrsJjrk5zsi5wg7J6I7Ja07JW8IO2VqCFcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XG4gIGlmIChyZXEubWV0aG9kICE9PSAnUE9TVCcpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDUpLmpzb24oeyBlcnJvcjogJ+2XiOyaqeuQmOyngCDslYrsnYAg7JqU7LKt7J6F64uI64ukLicgfSk7XG4gIH1cblxuICBjb25zdCB7IHByb21wdCB9ID0gcmVxLmJvZHk7XG5cbiAgaWYgKCFwcm9tcHQpIHtcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogJ+2UhOuhrO2UhO2KuOqwgCDsl4bsirXri4jri6QuJyB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgY29tcGxldGlvbiA9IGF3YWl0IG9wZW5haS5jaGF0LmNvbXBsZXRpb25zLmNyZWF0ZSh7XG4gICAgICBtb2RlbDogJ2dwdC0zLjUtdHVyYm8nLFxuICAgICAgbWVzc2FnZXM6IFt7IHJvbGU6ICd1c2VyJywgY29udGVudDogcHJvbXB0IH1dLFxuICAgICAgdGVtcGVyYXR1cmU6IDAuNyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IGNvbXBsZXRpb24uY2hvaWNlcz8uWzBdPy5tZXNzYWdlPy5jb250ZW50Py50cmltKCkgfHwgJyc7XG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyByZXN1bHQgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignT3BlbkFJIEFQSSDsmKTrpZg6JywgZXJyb3IpO1xuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6ICfrrLjqtawg7IOd7ISxIOykkSDsmKTrpZjqsIAg67Cc7IOd7ZaI7Ja07JqULicgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJPcGVuQUkiLCJvcGVuYWkiLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiT1BFTkFJX0FQSV9LRVkiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwibWV0aG9kIiwic3RhdHVzIiwianNvbiIsImVycm9yIiwicHJvbXB0IiwiYm9keSIsImNvbXBsZXRpb24iLCJjaGF0IiwiY29tcGxldGlvbnMiLCJjcmVhdGUiLCJtb2RlbCIsIm1lc3NhZ2VzIiwicm9sZSIsImNvbnRlbnQiLCJ0ZW1wZXJhdHVyZSIsInJlc3VsdCIsImNob2ljZXMiLCJtZXNzYWdlIiwidHJpbSIsImNvbnNvbGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(api)/./pages/api/gpt.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/gpt.ts"));
module.exports = __webpack_exports__;

})();