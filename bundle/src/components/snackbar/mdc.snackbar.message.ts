/**
 * The interface accepted by <code>MdcSnackbarService::show()</code>.
 */
export interface MdcSnackbarMessage {
    /**
     * The text message to display
     */
    message: string;
    /**
     * The text to display for the action button (optional, default is no action button).
     */
    actionText?: string,
    /**
     * Whether to show the snackbar with space for multiple lines of text (optional, default is false).
     */
    multiline?: boolean,
    /**
     * Whether to show the action below the multiple lines of text (optional, only applies when multiline is true).
     */
    actionOnBottom?: boolean,
    /**
     * The amount of time in milliseconds to show the snackbar (optional, default is 2750ms).
     */
    timeout?: number
}
