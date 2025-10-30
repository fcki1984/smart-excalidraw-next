'use client';

import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, onApply, onClear }) {
  return (
    <div className="flex flex-col h-full bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">生成的代码</h3>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            清除
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            应用到画布
          </button>
        </div>
      </div>
      <div className="flex-1 pb-4">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={onChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}

