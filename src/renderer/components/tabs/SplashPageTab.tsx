import { useConfigStore } from '../../store/useConfigStore';
import { ToggleField } from '../ui/FormField';

export default function SplashPageTab() {
  const { config, updateSection, theme } = useConfigStore();
  const d = theme === 'dark';

  if (!config) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
          Splash Page
        </h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Splash screen branding options.
        </p>
      </div>

      <div className={`card ${d ? 'card-dark' : 'card-light'} p-6 space-y-5`}>
        <ToggleField
          label="Dark Logo"
          hint="Use a dark-themed logo on the splash page."
          checked={config.splashPage.darkLogo}
          onChange={(checked) => updateSection('splashPage', { ...config.splashPage, darkLogo: checked })}
        />
      </div>
    </div>
  );
}
