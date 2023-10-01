import { Base58 } from "./crypto/base58";

/**
 * Class to help with colors.
 */
export class Colors {
    /**
     * Color size.
     */
    public static SIZE: number = 32;

    /**
     * Color for ZIPP token, all zeros.
     */
    public static ZIPP_BUFFER: Buffer = Buffer.from(new Uint8Array(Colors.SIZE).fill(0));

    /**
     * Color for ZIPP token, all zeros.
     */
    public static ZIPP_BASE58: string = Base58.encode(Colors.ZIPP_BUFFER);

    /**
     * Color for ZIPP token, all zeros.
     */
    public static ZIPP_NAME: string = "ZIPP";

    /**
     * Color for new Colors.
     */
    public static MINT: string = Base58.encode(Buffer.from(new Uint8Array(Colors.SIZE).fill(255)));
}
