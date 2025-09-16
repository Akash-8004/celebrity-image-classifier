import cv2
import pywt
import numpy as np

def wavelet_transform_highfreq(img_array, wavelet_name='haar', level=1):
   
    # Convert to grayscale if needed
    if len(img_array.shape) == 3 and img_array.shape[2] == 3:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_BGR2GRAY)
    
    # Convert to float32 and normalize to [0,1]
    imArray = np.float32(img_array) / 255.0

    # Perform wavelet decomposition
    coeffs = pywt.wavedec2(imArray, wavelet_name, level=level)

    # Zero out approximation coefficients (keep only detail)
    coeffs_H = list(coeffs)
    coeffs_H[0] *= 0

    # Reconstruct high-frequency image
    imArray_H = pywt.waverec2(coeffs_H, wavelet_name)
    imArray_H *= 255  # Scale back to 0–255
    imArray_H = np.uint8(np.clip(imArray_H, 0, 255))

    return imArray_H