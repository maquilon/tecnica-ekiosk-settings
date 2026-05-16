import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import { useConfigStore } from '../../store/useConfigStore';
import { companyConfigSchema } from '../../types/config';
import { CheckCircle2, XCircle, Copy, ClipboardPaste, Wand2 } from 'lucide-react';

export default function JsonEditorTab() {
  const { getSelectedCompany, updateFullCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  const [jsonText, setJsonText] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (selected) {
      setJsonText(JSON.stringify(selected, null, 2));
      setValidationErrors([]);
      setIsValid(true);
    }
  }, [selected?.company.id]);

  const validate = useCallback((text: string) => {
    try {
      const parsed = JSON.parse(text);
      const result = companyConfigSchema.safeParse(parsed);
      if (result.success) {
        setValidationErrors([]);
        setIsValid(true);
        return true;
      } else {
        const errs = result.error.issues.map(
          (i) => `${i.path.join('.')}: ${i.message}`,
        );
        setValidationErrors(errs);
        setIsValid(false);
        return false;
      }
    } catch (e) {
      setValidationErrors([(e as Error).message]);
      setIsValid(false);
      return false;
    }
  }, []);

  const handleChange = (value: string | undefined) => {
    const text = value || '';
    setJsonText(text);
    validate(text);
  };

  const handleApply = () => {
    if (!selected) return;
    if (validate(jsonText)) {
      try {
        const parsed = JSON.parse(jsonText);
        updateFullCompany(selected.company.id, parsed);
        toast.success('Changes applied');
      } catch {
        toast.error('Invalid JSON');
      }
    } else {
      toast.error('Fix validation errors before applying');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      toast.success('Formatted');
    } catch {
      toast.error('Cannot format invalid JSON');
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonText);
    toast.success('Copied to clipboard');
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setJsonText(text);
    validate(text);
    toast.success('Pasted from clipboard');
  };

  if (!selected) return null;

  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center justify-between px-4 py-2 border-b ${d ? 'bg-[#0a0a0a] border-[#1c1c1c]' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {isValid ? (
              <CheckCircle2 className="w-4 h-4 text-brand-success" />
            ) : (
              <XCircle className="w-4 h-4 text-brand-error" />
            )}
            <span className={`text-xs font-medium ${isValid ? 'text-brand-success' : 'text-brand-error'}`}>
              {isValid ? 'Valid JSON' : `${validationErrors.length} error(s)`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className={`p-1.5 rounded text-xs transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="Copy">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={handlePaste} className={`p-1.5 rounded text-xs transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="Paste">
            <ClipboardPaste className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleFormat} className={`p-1.5 rounded text-xs transition-colors ${d ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`} title="Format">
            <Wand2 className="w-3.5 h-3.5" />
          </button>
          <div className={`w-px h-4 mx-1 ${d ? 'bg-[#2c2c2c]' : 'bg-gray-200'}`} />
          <button onClick={handleApply} disabled={!isValid} className="btn btn-primary !px-3 !py-1 text-xs">
            Apply Changes
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          theme={d ? 'vs-dark' : 'light'}
          value={jsonText}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            formatOnPaste: true,
            padding: { top: 12 },
          }}
        />
      </div>

      {validationErrors.length > 0 && (
        <div className={`max-h-32 overflow-y-auto border-t px-4 py-2 ${d ? 'bg-brand-error/5 border-brand-error/20' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs font-medium text-brand-error mb-1">Validation Errors:</p>
          {validationErrors.map((err, i) => (
            <p key={i} className={`text-xs ${d ? 'text-red-400' : 'text-red-600'}`}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
