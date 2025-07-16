/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useEffect, useRef } from "react"
import QRcode from "qrcode"
import { getTableLink } from "@/lib/utils"

export default function QrCodeTable({
    token, tableNumber, width = 250
}: {
    token: string
    tableNumber: number
    width?: number
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        QRcode.toCanvas(
            canvas,
            getTableLink({
                token,
                tableNumber
            }),
            function (error) {
            if (error) console.error(error);
            console.log('QR code generated!');
        });
    }, [token, tableNumber]);

    return (
        <canvas
        ref = {canvasRef}
        />
      )
    }
