"use client";

import type { CSSProperties, ReactNode } from "react";
import { useCallback } from "react";
import { getTranslation } from "@payloadcms/translations";
import { FieldDescription as PayloadFieldDescription, FieldLabel as PayloadFieldLabel, RenderCustomComponent, TextField, useField, useTranslation } from "@payloadcms/ui";
import type { CheckboxFieldClientProps, CheckboxFieldValidation, SelectFieldClientProps, SelectFieldValidation, StaticDescription, StaticLabel, TextareaFieldClientProps, TextareaFieldValidation, TextFieldClientProps, TextFieldValidation, Validate } from "payload";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FieldStyle = CSSProperties & { "--field-width"?: number | string };
type FieldFrameProps = { AfterInput?: ReactNode; BeforeInput?: ReactNode; children: ReactNode; className?: string; customDescription?: ReactNode; customError?: ReactNode; customLabel?: ReactNode; description?: StaticDescription; disabled?: boolean; errorMessage?: string; label?: StaticLabel; localized?: boolean; path: string; required?: boolean; showError?: boolean; style: FieldStyle; variant: "select" | "text" | "textarea" };

function resolveFieldStyle(width?: number | string, style?: CSSProperties): FieldStyle {
  return { ...style, ...(width ? { "--field-width": width } : { flex: "1 1 auto" }), ...(style?.flex ? { flex: style.flex } : {}) };
}

function resolvePlaceholder(placeholder: unknown, i18n: Parameters<typeof getTranslation>[1]): string | undefined {
  if (!placeholder) return undefined;
  if (typeof placeholder === "string") return placeholder;
  if (typeof placeholder !== "object") return undefined;
  const translated = getTranslation(placeholder as Parameters<typeof getTranslation>[0], i18n);
  return typeof translated === "string" ? translated : undefined;
}

function FieldFrame({ AfterInput, BeforeInput, children, className, customDescription, customError, customLabel, description, disabled, errorMessage, label, localized, path, required, showError, style, variant }: FieldFrameProps) {
  return <Field aria-invalid={showError || undefined} className={cn("field-type", variant, className, showError && "error")} data-disabled={disabled || undefined} style={style}>
    <RenderCustomComponent CustomComponent={customLabel} Fallback={<PayloadFieldLabel label={label} localized={localized} path={path} required={required} />} />
    <FieldContent className="field-type__wrap">
      <RenderCustomComponent CustomComponent={customError} Fallback={<FieldError>{showError ? errorMessage : undefined}</FieldError>} />
      {BeforeInput}
      {children}
      {AfterInput}
      <RenderCustomComponent CustomComponent={customDescription} Fallback={<PayloadFieldDescription description={description} path={path} />} />
    </FieldContent>
  </Field>;
}

export function ShadcnTextField({ field, inputRef, onKeyDown, path: stalePath, readOnly, validate }: TextFieldClientProps) {
  const { admin = {}, hasMany, label, localized, maxLength, minLength, required } = field;
  const memoizedValidate = useCallback<TextFieldValidation>((value, options) => validate ? validate(value, { ...options, maxLength, minLength, required }) : true, [maxLength, minLength, required, validate]);
  const { customComponents = {}, disabled, errorMessage, path, setValue, showError, value } = useField<string>({ potentiallyStalePath: stalePath, validate: memoizedValidate as Validate });
  const { i18n } = useTranslation();
  if (hasMany) return <TextField field={field} inputRef={inputRef} onKeyDown={onKeyDown} path={stalePath} readOnly={readOnly} validate={validate} />;
  const isDisabled = Boolean(readOnly || disabled);
  return <FieldFrame AfterInput={customComponents.AfterInput} BeforeInput={customComponents.BeforeInput} className={admin.className} customDescription={customComponents.Description} customError={customComponents.Error} customLabel={customComponents.Label} description={admin.description} disabled={isDisabled} errorMessage={errorMessage} label={label} localized={localized} path={path} required={required} showError={showError} style={resolveFieldStyle(admin.width, admin.style)} variant="text">
    <Input aria-invalid={showError || undefined} autoComplete={admin.autoComplete || undefined} data-rtl={admin.rtl} disabled={isDisabled} id={`field-${path.replace(/\./g, "__")}`} maxLength={maxLength} minLength={minLength} name={path} onChange={(event) => setValue(event.target.value)} onKeyDown={onKeyDown} placeholder={resolvePlaceholder(admin.placeholder, i18n)} ref={inputRef} type="text" value={value || ""} />
  </FieldFrame>;
}

export function ShadcnTextareaField({ field, path: stalePath, readOnly, validate }: TextareaFieldClientProps) {
  const { admin = {}, label, localized, maxLength, minLength, required } = field;
  const memoizedValidate = useCallback<TextareaFieldValidation>((value, options) => validate ? validate(value, { ...options, maxLength, minLength, required }) : true, [maxLength, minLength, required, validate]);
  const { customComponents = {}, disabled, errorMessage, path, setValue, showError, value } = useField<string>({ potentiallyStalePath: stalePath, validate: memoizedValidate as Validate });
  const { i18n } = useTranslation();
  const isDisabled = Boolean(readOnly || disabled);
  return <FieldFrame AfterInput={customComponents.AfterInput} BeforeInput={customComponents.BeforeInput} className={admin.className} customDescription={customComponents.Description} customError={customComponents.Error} customLabel={customComponents.Label} description={admin.description} disabled={isDisabled} errorMessage={errorMessage} label={label} localized={localized} path={path} required={required} showError={showError} style={resolveFieldStyle(admin.width, admin.style)} variant="textarea">
    <Textarea aria-invalid={showError || undefined} data-rtl={admin.rtl} disabled={isDisabled} id={`field-${path.replace(/\./g, "__")}`} maxLength={maxLength} minLength={minLength} name={path} onChange={(event) => setValue(event.target.value)} placeholder={resolvePlaceholder(admin.placeholder, i18n)} rows={admin.rows} value={value || ""} />
  </FieldFrame>;
}

export function ShadcnCheckboxField({ checked, disableFormData, field, id, onChange, path: stalePath, readOnly, validate }: CheckboxFieldClientProps) {
  const { admin = {}, label, required } = field;
  const memoizedValidate = useCallback<CheckboxFieldValidation>((value, options) => validate ? validate(value, { ...options, required }) : true, [required, validate]);
  const { customComponents = {}, disabled, errorMessage, path, setValue, showError, value } = useField<boolean>({ disableFormData, potentiallyStalePath: stalePath, validate: memoizedValidate as Validate });
  const isDisabled = Boolean(readOnly || disabled);
  const fieldID = id || `field-${path.replace(/\./g, "__")}`;
  const isChecked = checked === undefined ? Boolean(value) : checked;
  return <Field aria-invalid={showError || undefined} className={cn("field-type checkbox", admin.className, showError && "error")} data-disabled={isDisabled || undefined} orientation="horizontal" style={resolveFieldStyle(admin.width, admin.style)}>
    {customComponents.BeforeInput}
    <Checkbox aria-invalid={showError || undefined} checked={isChecked} disabled={isDisabled} id={fieldID} name={path} onCheckedChange={(next) => { setValue(next); onChange?.(next); }} required={required} />
    <FieldContent>
      <RenderCustomComponent CustomComponent={customComponents.Label} Fallback={<PayloadFieldLabel htmlFor={fieldID} label={label} path={path} required={required} />} />
      <RenderCustomComponent CustomComponent={customComponents.Error} Fallback={<FieldError>{showError ? errorMessage : undefined}</FieldError>} />
      <RenderCustomComponent CustomComponent={customComponents.Description} Fallback={<PayloadFieldDescription description={admin.description} path={path} />} />
    </FieldContent>
    {customComponents.AfterInput}
  </Field>;
}

export function ShadcnSelectField({ field, onChange, path: stalePath, readOnly, validate }: SelectFieldClientProps) {
  const { hasMany = false, label, localized, options: rawOptions, required } = field;
  const admin = field.admin;
  const memoizedValidate = useCallback<SelectFieldValidation>((value, validationOptions) => validate ? (validate as SelectFieldValidation)(value, { ...validationOptions, hasMany, options: rawOptions, required } as Parameters<SelectFieldValidation>[1]) : true, [hasMany, rawOptions, required, validate]);
  const { customComponents = {}, disabled, errorMessage, path, setValue, showError, value } = useField<string | string[]>({ potentiallyStalePath: stalePath, validate: memoizedValidate as Validate });
  const { i18n } = useTranslation();
  const isDisabled = Boolean(readOnly || disabled);
  const options = rawOptions.map((option) => typeof option === "string" ? { label: option, value: option } : { label: getTranslation(option.label, i18n), value: option.value });
  const fieldID = `field-${path.replace(/\./g, "__")}`;
  const control = hasMany ? <Select<string, true> disabled={isDisabled} items={options} multiple name={path} onValueChange={(next) => { setValue(next); onChange?.(next); }} required={required} value={Array.isArray(value) ? value : []}><SelectTrigger aria-invalid={showError || undefined} className="w-full" id={fieldID}><SelectValue placeholder={resolvePlaceholder(admin?.placeholder, i18n)} /></SelectTrigger><SelectContent><SelectGroup>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select> : <Select<string> disabled={isDisabled} items={options} name={path} onValueChange={(next) => { const normalized = next || ""; setValue(normalized); onChange?.(normalized); }} required={required} value={typeof value === "string" ? value : null}><SelectTrigger aria-invalid={showError || undefined} className="w-full" id={fieldID}><SelectValue placeholder={resolvePlaceholder(admin?.placeholder, i18n)} /></SelectTrigger><SelectContent><SelectGroup>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select>;
  return <FieldFrame AfterInput={customComponents.AfterInput} BeforeInput={customComponents.BeforeInput} className={admin?.className} customDescription={customComponents.Description} customError={customComponents.Error} customLabel={customComponents.Label} description={admin?.description} disabled={isDisabled} errorMessage={errorMessage} label={label} localized={localized} path={path} required={required} showError={showError} style={resolveFieldStyle(admin?.width, admin?.style)} variant="select">{control}</FieldFrame>;
}
