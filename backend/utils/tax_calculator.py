# utils/tax_calculator.py

def calculate_tax(amount, tax_rate=0.18):
    """
    Calculates tax on a given amount.
    
    :param amount: The base amount (float or int)
    :param tax_rate: Tax rate as a decimal (default is 18% or 0.18)
    :return: Dictionary with base amount, tax amount, and total
    """
    try:
        tax = round(amount * tax_rate, 2)
        total = round(amount + tax, 2)
        return {
            "base_amount": round(amount, 2),
            "tax": tax,
            "total": total
        }
    except Exception as e:
        return {"error": str(e)}
