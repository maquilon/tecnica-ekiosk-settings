import { useConfigStore } from '../store/useConfigStore';
import { Bell, Home, Settings, User, Search, ChevronRight } from 'lucide-react';

export default function ThemePreview() {
  const { getSelectedCompany, theme } = useConfigStore();
  const selected = getSelectedCompany();
  const d = theme === 'dark';

  if (!selected) return null;

  const { branding: b, buttons: btn, typography: t, layout: l } = selected;

  return (
    <div className="p-6 max-w-4xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h2 className={`text-lg font-semibold ${d ? 'text-white' : 'text-gray-900'}`}>
          Live Theme Preview
        </h2>
        <p className={`text-sm mt-1 ${d ? 'text-gray-500' : 'text-gray-500'}`}>
          Real-time preview of the company's theme configuration.
        </p>
      </div>

      {/* Preview Container */}
      <div
        className="rounded-xl overflow-hidden border shadow-lg"
        style={{
          backgroundColor: b.backgroundColor,
          borderColor: b.borderColor,
          fontFamily: t.fontFamily,
          boxShadow: `0 4px 20px ${b.shadowColor}`,
        }}
      >
        {/* Header */}
        {l.headerFixed && (
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ backgroundColor: b.surfaceColor, borderColor: b.borderColor }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: b.primaryColor }}
              >
                <span style={{ color: btn.primaryTextColor, fontSize: 12, fontWeight: 700 }}>
                  {selected.company.name.charAt(0) || 'T'}
                </span>
              </div>
              <span
                style={{
                  color: b.textPrimaryColor,
                  fontFamily: t.headingFontFamily,
                  fontWeight: 600,
                  fontSize: `${t.fontSizeBase}px`,
                }}
              >
                {selected.company.displayName || 'Company Name'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4" style={{ color: b.textSecondaryColor }} />
              </div>
              <Bell className="w-4 h-4" style={{ color: b.textSecondaryColor }} />
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: b.primaryColor + '20' }}
              >
                <User className="w-3.5 h-3.5" style={{ color: b.primaryColor }} />
              </div>
            </div>
          </div>
        )}

        <div className="flex" style={{ minHeight: 320 }}>
          {/* Sidebar */}
          {l.sidebarStyle !== 'hidden' && (
            <div
              className="border-r flex-shrink-0"
              style={{
                width: l.sidebarStyle === 'expanded' ? 200 : 56,
                backgroundColor: b.surfaceColor,
                borderColor: b.borderColor,
              }}
            >
              <div className="p-3 space-y-1">
                {[
                  { icon: Home, label: 'Dashboard', active: true },
                  { icon: Settings, label: 'Settings', active: false },
                  { icon: User, label: 'Profile', active: false },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                      style={{
                        backgroundColor: item.active ? b.primaryColor + '15' : 'transparent',
                        borderRadius: `${l.cardBorderRadius * 0.6}px`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: item.active ? b.primaryColor : b.textSecondaryColor }}
                      />
                      {l.sidebarStyle === 'expanded' && (
                        <span
                          style={{
                            color: item.active ? b.primaryColor : b.textSecondaryColor,
                            fontSize: `${t.fontSizeBase * 0.85}px`,
                            fontWeight: item.active ? 600 : 400,
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 p-5">
            {/* Page Title */}
            <h1
              style={{
                color: b.textPrimaryColor,
                fontFamily: t.headingFontFamily,
                fontSize: `${t.fontSizeBase * t.fontScale * 1.5}px`,
                fontWeight: 700,
              }}
            >
              Dashboard
            </h1>
            <p
              className="mt-1 mb-5"
              style={{
                color: b.textSecondaryColor,
                fontSize: `${t.fontSizeBase * t.fontScale * 0.875}px`,
              }}
            >
              Welcome back to your workspace.
            </p>

            {/* Cards Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Revenue', value: '$12,450', color: b.successColor },
                { label: 'Users', value: '1,234', color: b.primaryColor },
                { label: 'Alerts', value: '3', color: b.warningColor },
              ].map((card) => (
                <div
                  key={card.label}
                  className="p-4 border"
                  style={{
                    backgroundColor: b.surfaceColor,
                    borderColor: b.borderColor,
                    borderRadius: `${l.cardBorderRadius}px`,
                  }}
                >
                  <p style={{ color: b.labelTextColor, fontSize: `${t.fontSizeBase * 0.75}px` }}>
                    {card.label}
                  </p>
                  <p
                    className="mt-1"
                    style={{
                      color: card.color,
                      fontSize: `${t.fontSizeBase * 1.25}px`,
                      fontWeight: 700,
                      fontFamily: t.headingFontFamily,
                    }}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Form Preview */}
            <div
              className="p-4 border mb-5"
              style={{
                backgroundColor: b.surfaceColor,
                borderColor: b.borderColor,
                borderRadius: `${l.cardBorderRadius}px`,
              }}
            >
              <h3
                className="mb-3"
                style={{
                  color: b.textPrimaryColor,
                  fontFamily: t.headingFontFamily,
                  fontSize: `${t.fontSizeBase}px`,
                  fontWeight: 600,
                }}
              >
                Sample Form
              </h3>
              <div className="space-y-3">
                <div>
                  <label style={{ color: b.labelTextColor, fontSize: `${t.fontSizeBase * 0.75}px` }}>
                    Email Address
                  </label>
                  <div
                    className="mt-1 px-3 py-2 border"
                    style={{
                      backgroundColor: b.backgroundColor,
                      borderColor: b.borderColor,
                      borderRadius: `${btn.borderRadius}px`,
                      color: b.textSecondaryColor,
                      fontSize: `${t.fontSizeBase * 0.875}px`,
                    }}
                  >
                    user@example.com
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-4 py-2"
                    style={{
                      backgroundColor: btn.primaryBackground,
                      color: btn.primaryTextColor,
                      borderRadius: `${btn.borderRadius}px`,
                      fontWeight: btn.fontWeight,
                      fontSize: `${t.fontSizeBase * 0.875}px`,
                    }}
                  >
                    Submit
                  </button>
                  <button
                    className="px-4 py-2 border"
                    style={{
                      backgroundColor: btn.secondaryBackground,
                      color: btn.secondaryTextColor,
                      borderColor: btn.secondaryTextColor,
                      borderRadius: `${btn.borderRadius}px`,
                      fontWeight: btn.fontWeight,
                      fontSize: `${t.fontSizeBase * 0.875}px`,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-2">
              {[
                { msg: 'Operation completed successfully', color: b.successColor, bg: b.successColor + '15' },
                { msg: 'Please review the warnings below', color: b.warningColor, bg: b.warningColor + '15' },
                { msg: 'An error occurred while processing', color: b.errorColor, bg: b.errorColor + '15' },
              ].map((status) => (
                <div
                  key={status.msg}
                  className="flex items-center gap-2 px-3 py-2"
                  style={{
                    backgroundColor: status.bg,
                    borderRadius: `${btn.borderRadius}px`,
                    color: status.color,
                    fontSize: `${t.fontSizeBase * 0.8}px`,
                  }}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  {status.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
