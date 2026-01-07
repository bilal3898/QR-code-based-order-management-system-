# services/qr_code_service.py

import qrcode
import os
import logging
from io import BytesIO
from base64 import b64encode

from fastapi.responses import StreamingResponse

class QRCodeService:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.qr_folder = "static/qr_codes"
        os.makedirs(self.qr_folder, exist_ok=True)

    def generate_qr_code(self, data_type: str, identifier: str):
        try:
            qr_data = f"{self.base_url}/{data_type}/{identifier}"
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=4,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")

            file_path = os.path.join(self.qr_folder, f"{data_type}_{identifier}.png")
            img.save(file_path)
            return {
                "message": "QR code generated successfully",
                "url": qr_data,
                "image_path": file_path
            }
        except Exception as e:
            logging.error(f"Error generating QR code: {str(e)}")
            return {"error": str(e)}

    def get_qr_code_image(self, data_type: str, identifier: str):
        try:
            file_path = os.path.join(self.qr_folder, f"{data_type}_{identifier}.png")
            if not os.path.exists(file_path):
                return {"error": "QR code image not found"}
            
            return StreamingResponse(open(file_path, "rb"), media_type="image/png")
        except Exception as e:
            logging.error(f"Error retrieving QR code image: {str(e)}")
            return {"error": str(e)}

    def get_qr_code_base64(self, data_type: str, identifier: str):
        try:
            file_path = os.path.join(self.qr_folder, f"{data_type}_{identifier}.png")
            if not os.path.exists(file_path):
                return {"error": "QR code not found"}
            
            with open(file_path, "rb") as f:
                encoded = b64encode(f.read()).decode("utf-8")
                return {
                    "qr_code_base64": f"data:image/png;base64,{encoded}"
                }
        except Exception as e:
            logging.error(f"Error converting QR code to base64: {str(e)}")
            return {"error": str(e)}
