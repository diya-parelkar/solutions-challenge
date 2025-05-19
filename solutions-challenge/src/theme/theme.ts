// Type definitions for theme
type ThemeMode = 'light' | 'dark' | 'colorblind';

export type ThemeColors = {
  background: {
    primary: string;
    secondary: string;
    header: string;
    card: string;
    code: string;
    blockquote: string;
    hover: {
      button: string;
      navigation: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    link: string;
    code: string;
    table: {
      header: string;
      cell: string;
    };
  };
  border: {
    primary: string;
    secondary: string;
    table: string;
    blockquote: string;
  };
  accent: {
    gradient: string;
    blue: string;
    emerald: string;
    progress: string;
  };
  badge: {
    emerald: string;
    blue: string;
  };
  states: {
    loading: {
      skeleton: string;
    };
  };
};

export type ColorblindColors = {
  background: {
    primary: string;
    header: string;
    card: string;
    code: string;
    blockquote: string;
    hover: {
      button: string;
      navigation: string;
    };
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    link: string;
    code: string;
    table: {
      header: string;
      cell: string;
    };
  };
  border: {
    primary: string;
    secondary: string;
    table: string;
    blockquote: string;
  };
  accent: {
    gradient: string;
    button: {
      enabled: string;
      disabled: string;
    };
  };
  badge: {
    emerald: string;
    blue: string;
  };
  states: {
    loading: {
      skeleton: string;
    };
  };
};

interface StateColors {
  loading: {
    skeleton: string;
    progress: string;
  };
  interactive: {
    hover: string;
    active: string;
    disabled: string;
  };
  badge: {
    emerald: string;
    blue: string;
  };
}

export type Theme = {
  light: ThemeColors;
  dark: ThemeColors;
  colorblind: ColorblindColors;
};

export const theme = {
  light: {
    background: {
      primary: 'bg-white',
      header: 'bg-white/80',
      card: 'bg-white/80',
      code: 'bg-gray-100',
      blockquote: 'bg-gray-50',
      hover: {
        button: 'hover:bg-gray-100',
        navigation: 'hover:bg-gray-50/50'
      }
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
      link: 'text-gray-900',
      code: 'text-gray-900',
      table: {
        header: 'text-gray-900',
        cell: 'text-gray-900'
      }
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
      table: 'border-gray-200',
      blockquote: 'border-gray-300'
    },
    accent: {
      gradient: 'from-emerald-600 via-emerald-500 to-emerald-400',
      button: {
        enabled: 'bg-emerald-500 hover:bg-emerald-600 text-white',
        disabled: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    },
    badge: {
      emerald: 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10',
      blue: 'bg-blue-500/5 text-blue-500 border-blue-500/10'
    },
    states: {
      loading: {
        skeleton: 'bg-gray-200'
      }
    }
  },
  dark: {
    background: {
      primary: 'bg-[#1a1a1a]',
      header: 'bg-gray-900/80',
      card: 'bg-gray-900/80',
      code: 'bg-gray-800',
      blockquote: 'bg-gray-800/50',
      hover: {
        button: 'hover:bg-gray-800',
        navigation: 'hover:bg-gray-800/50'
      }
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
      link: 'text-white',
      code: 'text-white',
      table: {
        header: 'text-white',
        cell: 'text-white'
      }
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
      table: 'border-gray-200',
      blockquote: 'border-gray-300'
    },
    accent: {
      gradient: 'from-emerald-400 dark:via-emerald-300 dark:to-emerald-200',
      button: {
        enabled: 'dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white',
        disabled: 'dark:bg-transparent dark:hover:bg-gray-800 dark:text-gray-300'
      }
    },
    badge: {
      emerald: 'dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/10',
      blue: 'dark:bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/10'
    },
    states: {
      loading: {
        skeleton: 'dark:bg-gray-800'
      }
    }
  },
  colorblind: {
    background: {
      primary: 'bg-white dark:bg-[#1a1a1a]',
      header: 'bg-white/80 dark:bg-[#1a1a1a]/80',
      card: 'bg-white/80 dark:bg-gray-900/80',
      code: 'bg-gray-100 dark:bg-gray-800',
      blockquote: 'bg-gray-50 dark:bg-gray-800/50',
      hover: {
        button: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        navigation: 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
      }
    },
    text: {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-600 dark:text-gray-300',
      muted: 'text-gray-500 dark:text-gray-400',
      link: 'text-gray-900 dark:text-gray-100',
      code: 'text-gray-900 dark:text-gray-100',
      table: {
        header: 'text-gray-900 dark:text-gray-100',
        cell: 'text-gray-900 dark:text-gray-100'
      }
    },
    border: {
      primary: 'border-gray-200 dark:border-gray-800',
      secondary: 'border-gray-300 dark:border-gray-700',
      table: 'border-gray-200 dark:border-gray-800',
      blockquote: 'border-gray-300 dark:border-gray-700'
    },
    accent: {
      gradient: 'from-blue-600 via-blue-500 to-blue-400 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200',
      button: {
        enabled: 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-white',
        disabled: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    },
    badge: {
      emerald: 'bg-blue-500/5 text-blue-500 border-blue-500/10 dark:bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/10',
      blue: 'bg-blue-500/5 text-blue-500 border-blue-500/10 dark:bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/10'
    },
    states: {
      loading: {
        skeleton: 'bg-gray-200 dark:bg-gray-800'
      }
    }
  }
};

// Helper function to combine classes
export const combineClasses = (themeClasses: string, additionalClasses: string): string => {
  return `${themeClasses} ${additionalClasses}`.trim();
};

// Helper function to get theme classes based on mode
export const getThemeClasses = (mode: ThemeMode, type: ThemeType): string => {
  const modeColors = theme[mode];
  if (!modeColors) return '';

  const [category, subcategory, ...rest] = type.split('.');
  if (!category || !subcategory) return '';

  const categoryObj = modeColors[category as keyof typeof modeColors];
  if (!categoryObj) return '';

  const subcategoryObj = categoryObj[subcategory as keyof typeof categoryObj];
  if (!subcategoryObj) return '';

  if (rest.length === 0) {
    return typeof subcategoryObj === 'string' ? subcategoryObj : '';
  }

  const finalObj = rest.reduce((obj, key) => {
    if (typeof obj === 'object' && obj !== null) {
      return obj[key as keyof typeof obj];
    }
    return '';
  }, subcategoryObj);

  return typeof finalObj === 'string' ? finalObj : '';
};

export type ThemeType = 
  | 'background.primary'
  | 'background.header'
  | 'background.card'
  | 'background.code'
  | 'background.blockquote'
  | 'background.hover.button'
  | 'background.hover.navigation'
  | 'text.primary'
  | 'text.secondary'
  | 'text.muted'
  | 'text.link'
  | 'text.code'
  | 'text.table.header'
  | 'text.table.cell'
  | 'border.primary'
  | 'border.secondary'
  | 'border.table'
  | 'border.blockquote'
  | 'accent.gradient'
  | 'accent.button.enabled'
  | 'accent.button.disabled'
  | 'badge.emerald'
  | 'badge.blue'
  | 'states.loading.skeleton'; 