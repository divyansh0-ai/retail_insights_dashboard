import pandas as pd


def load_and_clean_data(filepath="data/Online Retail.xlsx"):
    """Load the Excel file and clean the data."""
    df = pd.read_excel(filepath)

    # Remove rows with missing CustomerID
    df = df.dropna(subset=["CustomerID"])

    # Convert CustomerID to integer
    df["CustomerID"] = df["CustomerID"].astype(int)

    # Remove cancellations (InvoiceNo starts with 'C')
    df = df[~df["InvoiceNo"].astype(str).str.startswith("C")]

    # Remove negative or zero Quantity
    df = df[df["Quantity"] > 0]

    # Remove zero or negative UnitPrice
    df = df[df["UnitPrice"] > 0]

    # Convert InvoiceDate to datetime
    df["InvoiceDate"] = pd.to_datetime(df["InvoiceDate"])

    # Create TotalPrice column
    df["TotalPrice"] = df["Quantity"] * df["UnitPrice"]

    return df
