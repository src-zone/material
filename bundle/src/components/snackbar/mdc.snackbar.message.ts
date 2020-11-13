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
     * Action buttons with long texts should be positioned below the label instead of alongside it.
     * Set the stacked option to true to accomplish this.
     */
    stacked?: boolean,
    /**
     * The amount of time in milliseconds to show the snackbar (optional, default is 5000ms).
     * Value must be between 4000 and 10000, or -1 to disable the timeout completely.
     */
    timeout?: number,
}
