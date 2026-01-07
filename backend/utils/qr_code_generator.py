import qrcode
import base64
import io

def generate_qr_code(data, box_size=10, border=5, fill_color="black", back_color="white"):
    """
    Generate a base64-encoded QR code image from the given data.
    
    Parameters:
    - data (str): The content to encode in the QR code.
    - box_size (int): Size of each box in the QR code grid.
    - border (int): Thickness of the border (in boxes).
    - fill_color (str): Color of the QR code modules.
    - back_color (str): Background color of the QR code.
    
    Returns:
    - str: Base64-encoded PNG image of the QR code.
    """

    if not isinstance(data, str) or not data.strip():
        raise ValueError("Invalid input: data must be a non-empty string")

    try:
        qr = qrcode.QRCode(
            version=1,
            box_size=box_size,
            border=border
        )
        qr.add_data(data)
        qr.make(fit=True)

        img = qr.make_image(fill_color=fill_color, back_color=back_color)

        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode("utf-8")

    except Exception as e:
        raise RuntimeError(f"Failed to generate QR code: {e}")
