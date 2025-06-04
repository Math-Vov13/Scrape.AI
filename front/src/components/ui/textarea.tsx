import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
	<textarea
	  className={`border rounded px-3 py-2 focus:outline-none focus:ring w-full ${className ?? ""}`}
	  ref={ref}
	  {...props}
	/>
  )
);

Textarea.displayName = "Textarea";