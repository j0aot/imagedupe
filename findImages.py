import os

def load_image(image_path):
    with open(image_path, "rb") as f:
        return f.read()

def calculate_signature(image_data):
    return sum(byte for byte in image_data)

def find_duplicates(image_dir):
    signatures = {}
    duplicates = []

    for filename in os.listdir(image_dir):
        if filename.endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif")):
            image_path = os.path.join(image_dir, filename)
            image_data = load_image(image_path)
            signature = calculate_signature(image_data)

            if signature in signatures:
                duplicates.append((filename, signatures[signature]))
            else:
                signatures[signature] = filename

    return duplicates

def main():
    image_dir = "images"
    duplicates = find_duplicates(image_dir)

    if duplicates:
        print("Imagens duplicadas encontradas:")
        for dup in duplicates:
            print(f"{dup[0]} é duplicada de {dup[1]}")
    else:
        print("Nenhuma imagem duplicada encontrada.")

if __name__ == "__main__":
    main()