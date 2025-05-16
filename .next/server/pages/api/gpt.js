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

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var openai__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! openai */ \"openai\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([openai__WEBPACK_IMPORTED_MODULE_0__]);\nopenai__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// pages/api/gpt.ts\n\n// 🔐 환경변수에서 API 키 불러오기 (.env.local에 있어야 함!)\nconst openai = new openai__WEBPACK_IMPORTED_MODULE_0__[\"default\"]({\n    apiKey: process.env.OPENAI_API_KEY\n});\nasync function handler(req, res) {\n    if (req.method !== \"POST\") {\n        return res.status(405).json({\n            error: \"허용되지 않은 요청입니다.\"\n        });\n    }\n    const { prompt } = req.body;\n    // ✅ 프론트에서 온 prompt 확인\n    console.log(\"\\uD83D\\uDCE8 받은 프롬프트:\", prompt);\n    if (!prompt) {\n        return res.status(400).json({\n            error: \"프롬프트가 없습니다.\"\n        });\n    }\n    try {\n        // 🔍 GPT-3.5 Turbo 모델에 요청 보내기\n        const completion = await openai.chat.completions.create({\n            model: \"gpt-3.5-turbo\",\n            messages: [\n                {\n                    role: \"user\",\n                    content: prompt\n                }\n            ],\n            temperature: 0.7\n        });\n        const result = completion.choices?.[0]?.message?.content?.trim() || \"\";\n        // ✅ 실제 생성된 결과 출력\n        console.log(\"\\uD83C\\uDFAF 생성된 결과:\", result);\n        res.status(200).json({\n            result\n        });\n    } catch (error) {\n        console.error(\"❌ OpenAI API 오류:\", error.response?.data || error.message);\n        res.status(500).json({\n            error: \"문구 생성 중 오류가 발생했어요.\"\n        });\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ3B0LnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsbUJBQW1CO0FBRVM7QUFFNUIsNENBQTRDO0FBQzVDLE1BQU1DLFNBQVMsSUFBSUQsOENBQU1BLENBQUM7SUFDeEJFLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsY0FBYztBQUNwQztBQUVlLGVBQWVDLFFBQVFDLEdBQW1CLEVBQUVDLEdBQW9CO0lBQzdFLElBQUlELElBQUlFLE1BQU0sS0FBSyxRQUFRO1FBQ3pCLE9BQU9ELElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFpQjtJQUN4RDtJQUVBLE1BQU0sRUFBRUMsTUFBTSxFQUFFLEdBQUdOLElBQUlPLElBQUk7SUFFM0Isc0JBQXNCO0lBQ3RCQyxRQUFRQyxHQUFHLENBQUMseUJBQWVIO0lBRTNCLElBQUksQ0FBQ0EsUUFBUTtRQUNYLE9BQU9MLElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFjO0lBQ3JEO0lBRUEsSUFBSTtRQUNGLDhCQUE4QjtRQUM5QixNQUFNSyxhQUFhLE1BQU1oQixPQUFPaUIsSUFBSSxDQUFDQyxXQUFXLENBQUNDLE1BQU0sQ0FBQztZQUN0REMsT0FBTztZQUNQQyxVQUFVO2dCQUFDO29CQUFFQyxNQUFNO29CQUFRQyxTQUFTWDtnQkFBTzthQUFFO1lBQzdDWSxhQUFhO1FBQ2Y7UUFFQSxNQUFNQyxTQUFTVCxXQUFXVSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUVDLFNBQVNKLFNBQVNLLFVBQVU7UUFFcEUsaUJBQWlCO1FBQ2pCZCxRQUFRQyxHQUFHLENBQUMsd0JBQWNVO1FBRTFCbEIsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFZTtRQUFPO0lBQ2hDLEVBQUUsT0FBT2QsT0FBWTtRQUNuQkcsUUFBUUgsS0FBSyxDQUFDLG9CQUFvQkEsTUFBTWtCLFFBQVEsRUFBRUMsUUFBUW5CLE1BQU1nQixPQUFPO1FBQ3ZFcEIsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXFCO0lBQ3JEO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tYXJrZXRlci1ib3QvLi9wYWdlcy9hcGkvZ3B0LnRzPzRkZDMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gcGFnZXMvYXBpL2dwdC50c1xuaW1wb3J0IHsgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZSB9IGZyb20gJ25leHQnO1xuaW1wb3J0IE9wZW5BSSBmcm9tICdvcGVuYWknO1xuXG4vLyDwn5SQIO2ZmOqyveuzgOyImOyXkOyEnCBBUEkg7YKkIOu2iOufrOyYpOq4sCAoLmVudi5sb2NhbOyXkCDsnojslrTslbwg7ZWoISlcbmNvbnN0IG9wZW5haSA9IG5ldyBPcGVuQUkoe1xuICBhcGlLZXk6IHByb2Nlc3MuZW52Lk9QRU5BSV9BUElfS0VZLFxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcbiAgaWYgKHJlcS5tZXRob2QgIT09ICdQT1NUJykge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwNSkuanNvbih7IGVycm9yOiAn7ZeI7Jqp65CY7KeAIOyViuydgCDsmpTssq3snoXri4jri6QuJyB9KTtcbiAgfVxuXG4gIGNvbnN0IHsgcHJvbXB0IH0gPSByZXEuYm9keTtcblxuICAvLyDinIUg7ZSE66Gg7Yq47JeQ7IScIOyYqCBwcm9tcHQg7ZmV7J24XG4gIGNvbnNvbGUubG9nKCfwn5OoIOuwm+ydgCDtlITroaztlITtirg6JywgcHJvbXB0KTtcblxuICBpZiAoIXByb21wdCkge1xuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IGVycm9yOiAn7ZSE66Gs7ZSE7Yq46rCAIOyXhuyKteuLiOuLpC4nIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyDwn5SNIEdQVC0zLjUgVHVyYm8g66qo64247JeQIOyalOyyrSDrs7TrgrTquLBcbiAgICBjb25zdCBjb21wbGV0aW9uID0gYXdhaXQgb3BlbmFpLmNoYXQuY29tcGxldGlvbnMuY3JlYXRlKHtcbiAgICAgIG1vZGVsOiAnZ3B0LTMuNS10dXJibycsXG4gICAgICBtZXNzYWdlczogW3sgcm9sZTogJ3VzZXInLCBjb250ZW50OiBwcm9tcHQgfV0sXG4gICAgICB0ZW1wZXJhdHVyZTogMC43LFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gY29tcGxldGlvbi5jaG9pY2VzPy5bMF0/Lm1lc3NhZ2U/LmNvbnRlbnQ/LnRyaW0oKSB8fCAnJztcblxuICAgIC8vIOKchSDsi6TsoJwg7IOd7ISx65CcIOqysOqzvCDstpzroKVcbiAgICBjb25zb2xlLmxvZygn8J+OryDsg53shLHrkJwg6rKw6rO8OicsIHJlc3VsdCk7XG5cbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IHJlc3VsdCB9KTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ+KdjCBPcGVuQUkgQVBJIOyYpOulmDonLCBlcnJvci5yZXNwb25zZT8uZGF0YSB8fCBlcnJvci5tZXNzYWdlKTtcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVycm9yOiAn66y46rWsIOyDneyEsSDspJEg7Jik66WY6rCAIOuwnOyDne2WiOyWtOyalC4nIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiT3BlbkFJIiwib3BlbmFpIiwiYXBpS2V5IiwicHJvY2VzcyIsImVudiIsIk9QRU5BSV9BUElfS0VZIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIm1ldGhvZCIsInN0YXR1cyIsImpzb24iLCJlcnJvciIsInByb21wdCIsImJvZHkiLCJjb25zb2xlIiwibG9nIiwiY29tcGxldGlvbiIsImNoYXQiLCJjb21wbGV0aW9ucyIsImNyZWF0ZSIsIm1vZGVsIiwibWVzc2FnZXMiLCJyb2xlIiwiY29udGVudCIsInRlbXBlcmF0dXJlIiwicmVzdWx0IiwiY2hvaWNlcyIsIm1lc3NhZ2UiLCJ0cmltIiwicmVzcG9uc2UiLCJkYXRhIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/gpt.ts\n");

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