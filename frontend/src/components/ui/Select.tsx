import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useId,
} from 'react';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────────────────────────────────
 */

// Any plain object works as an option — labelKey / valueKey point at the
// fields to use, same convention as the Angular version.
export type SelectOption = Record<string, any>;

interface BaseProps {
  options: SelectOption[];
  labelKey?: string;
  /** Optional secondary label rendered as "label - label2" (e.g. code + name) */
  labelKey2?: string;
  valueKey?: string;
  placeholder?: string;
  /** Alphabetically sort options (selected items always float to the top) */
  enableSorting?: boolean;
  enableSearch?: boolean;
  disabled?: boolean;
  className?: string;
  /** Bump this (any changed value) to force-clear the selection from outside */
  resetTrigger?: any;
  /** How many rows to render before lazy-revealing more on scroll */
  pageSize?: number;
}

interface SingleSelectProps extends BaseProps {
  multiple?: false;
  value: any;
  onChange: (value: any, option: SelectOption | undefined) => void;
}

interface MultiSelectProps extends BaseProps {
  multiple: true;
  value: any[];
  onChange: (value: any[], options: SelectOption[]) => void;
  /** 0 / undefined = unlimited */
  maxSelection?: number;
  showSelectAll?: boolean;
}

export type SelectProps = SingleSelectProps | MultiSelectProps;

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Small local hooks
 * ─────────────────────────────────────────────────────────────────────────
 */

function useOutsideClick(ref: React.RefObject<HTMLElement>, onOutside: () => void) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onOutside]);
}

function useDebouncedCallback<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay],
  );
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Tooltip — shown on hover over the "N selected" chip summary
 * ─────────────────────────────────────────────────────────────────────────
 */

function SelectedTooltip({ labels }: { labels: string[] }) {
  const [visible, setVisible] = useState(false);

  if (labels.length === 0) return null;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
        {labels.length} selected
      </span>

      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
        >
          <div className="max-h-40 overflow-y-auto pr-1">
            <ul className="space-y-1">
              {labels.map((l, i) => (
                <li key={i} className="whitespace-nowrap">
                  {l}
                </li>
              ))}
            </ul>
          </div>
          <div className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
        </div>
      )}
    </span>
  );
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Select component (single + multi)
 * ─────────────────────────────────────────────────────────────────────────
 */

export default function Select(props: SelectProps) {
  const {
    options,
    labelKey = 'label',
    labelKey2,
    valueKey = 'value',
    placeholder = 'Select',
    enableSorting = true,
    enableSearch = true,
    disabled = false,
    className = '',
    resetTrigger,
    pageSize = 50,
    multiple,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [activeIndex, setActiveIndex] = useState(-1);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Normalize current selection to an array for internal bookkeeping,
  // regardless of single/multi mode.
  const selectedValues: any[] = multiple
    ? (props as MultiSelectProps).value ?? []
    : (props as SingleSelectProps).value === undefined || (props as SingleSelectProps).value === null
    ? []
    : [(props as SingleSelectProps).value];

  const isSelected = useCallback(
    (opt: SelectOption) => selectedValues.includes(opt[valueKey]),
    [selectedValues, valueKey],
  );

  // Close + reset transient UI state on outside click
  useOutsideClick(rootRef, () => setIsOpen(false));

  // Reset selection whenever resetTrigger changes (after the first render)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (multiple) {
      (props as MultiSelectProps).onChange([], []);
    } else {
      (props as SingleSelectProps).onChange(undefined, undefined);
    }
    setSearch('');
    setIsOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetTrigger]);

  /** Filtered + sorted option list — selected items float to the top, then A→Z */
  const filteredOptions = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = options.filter((opt) => {
      const label = (opt[labelKey] ?? '').toString().toLowerCase();
      const label2 = (opt[labelKey2 ?? ''] ?? '').toString().toLowerCase();
      const val = (opt[valueKey] ?? '').toString().toLowerCase();
      return label.includes(term) || label2.includes(term) || val.includes(term);
    });

    if (enableSorting) {
      const byLabel = (a: SelectOption, b: SelectOption) =>
        (a[labelKey] ?? '').toString().localeCompare((b[labelKey] ?? '').toString());

      const selected = list.filter(isSelected).sort(byLabel);
      const unselected = list.filter((o) => !isSelected(o)).sort(byLabel);
      list = [...selected, ...unselected];
    } else {
      // still float selected items to the top, keep original order otherwise
      const selected = list.filter(isSelected);
      const unselected = list.filter((o) => !isSelected(o));
      list = [...selected, ...unselected];
    }

    return list;
  }, [options, search, labelKey, labelKey2, valueKey, enableSorting, isSelected]);

  const visibleOptions = filteredOptions.slice(0, visibleCount);

  const selectedLabels = useMemo(
    () =>
      options
        .filter(isSelected)
        .map((o) => (labelKey2 && o[labelKey2] ? `${o[labelKey]} - ${o[labelKey2]}` : o[labelKey])),
    [options, isSelected, labelKey, labelKey2],
  );

  const maxSelection = multiple ? (props as MultiSelectProps).maxSelection ?? 0 : 0;
  const atMax = multiple && maxSelection > 0 && selectedValues.length >= maxSelection;

  const emitMulti = useDebouncedCallback((values: any[]) => {
    const opts = options.filter((o) => values.includes(o[valueKey]));
    (props as MultiSelectProps).onChange(values, opts);
  }, 250);

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((o) => !o);
    setSearch('');
    setVisibleCount(pageSize);
    setActiveIndex(-1);
  };

  useEffect(() => {
    if (isOpen && enableSearch) {
      // wait for DOM paint before focusing
      const t = setTimeout(() => searchRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [isOpen, enableSearch]);

  const selectOption = (opt: SelectOption) => {
    if (disabled) return;
    const val = opt[valueKey];

    if (multiple) {
      let next: any[];
      if (selectedValues.includes(val)) {
        next = selectedValues.filter((v) => v !== val);
      } else {
        if (atMax) return;
        next = [...selectedValues, val];
      }
      emitMulti(next);
    } else {
      (props as SingleSelectProps).onChange(val, opt);
      setIsOpen(false);
    }
  };

  const isAllSelected = useMemo(() => {
    if (!multiple || filteredOptions.length === 0) return false;
    return filteredOptions.every((o) => selectedValues.includes(o[valueKey]));
  }, [multiple, filteredOptions, selectedValues, valueKey]);

  const toggleSelectAll = () => {
    if (!multiple) return;
    const allValues = options.map((o) => o[valueKey]);

    if (isAllSelected) {
      const next = selectedValues.filter((v) => !allValues.includes(v));
      emitMulti(next);
    } else if (maxSelection > 0) {
      const remaining = maxSelection - selectedValues.length;
      if (remaining <= 0) return;
      const toAdd = allValues.filter((v) => !selectedValues.includes(v)).slice(0, remaining);
      emitMulti([...selectedValues, ...toAdd]);
    } else {
      emitMulti(Array.from(new Set([...selectedValues, ...allValues])));
    }
  };

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const reachedBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
    if (reachedBottom && visibleCount < filteredOptions.length) {
      setVisibleCount((c) => c + pageSize);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
      }
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter' && activeIndex >= 0 && visibleOptions[activeIndex]) {
      e.preventDefault();
      selectOption(visibleOptions[activeIndex]);
    }
  };

  const summaryLabel = multiple
    ? undefined // rendered via tooltip chip instead
    : options.find((o) => o[valueKey] === (props as SingleSelectProps).value)?.[labelKey];

  return (
    <div
      ref={rootRef}
      className={`relative w-full text-sm ${className}`}
      onKeyDown={onKeyDown}
    >
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition
          ${disabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : 'bg-white hover:border-indigo-400'}
          ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-300'}`}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 truncate">
          {multiple ? (
            selectedValues.length === 0 ? (
              <span className="truncate text-slate-400">{placeholder}</span>
            ) : (
              <SelectedTooltip labels={selectedLabels} />
            )
          ) : summaryLabel ? (
            <span className="truncate text-slate-800">{summaryLabel}</span>
          ) : (
            <span className="truncate text-slate-400">{placeholder}</span>
          )}
        </span>

        <svg
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {enableSearch && (
            <div className="border-b border-slate-100 p-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(pageSize);
                  setActiveIndex(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search..."
                className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          )}

          {multiple && (props as MultiSelectProps).showSelectAll && filteredOptions.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 border-b border-slate-100 px-3 py-2 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-slate-700">Select All</span>
            </label>
          )}

          <div
            role="listbox"
            id={listId}
            aria-multiselectable={multiple}
            onScroll={onScroll}
            className="max-h-56 overflow-y-auto py-1"
          >
            {visibleOptions.length === 0 && (
              <div className="px-3 py-4 text-center text-slate-400">No results found</div>
            )}

            {visibleOptions.map((opt, i) => {
              const selected = isSelected(opt);
              const disabledRow = multiple && !selected && atMax;

              return (
                <div
                  key={opt[valueKey] ?? i}
                  role="option"
                  aria-selected={selected}
                  onClick={() => !disabledRow && selectOption(opt)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors
                    ${selected ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700'}
                    ${i === activeIndex ? 'bg-slate-100' : ''}
                    ${disabledRow ? 'cursor-not-allowed opacity-40' : 'hover:bg-slate-50'}`}
                >
                  {multiple ? (
                    <input
                      type="checkbox"
                      readOnly
                      checked={selected}
                      disabled={disabledRow}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  ) : (
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                      }`}
                    >
                      {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  )}
                  <span className="truncate">
                    {labelKey2 && opt[labelKey2] ? `${opt[labelKey]} - ${opt[labelKey2]}` : opt[labelKey]}
                  </span>
                </div>
              );
            })}
          </div>

          {multiple && maxSelection > 0 && (
            <div className="border-t border-slate-100 px-3 py-1.5 text-xs text-slate-400">
              {selectedValues.length}/{maxSelection} selected
            </div>
          )}
        </div>
      )}
    </div>
  );
}
