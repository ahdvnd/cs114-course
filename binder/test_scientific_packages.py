#!/usr/bin/env python3
"""
Test script to verify scipy, numpy, and matplotlib are working correctly.
Run this in your Binder environment to test the scientific packages.
"""

import sys

def test_imports():
    """Test importing the scientific packages"""
    print("Testing package imports...")
    
    try:
        import numpy as np
        print(f"✅ NumPy {np.__version__} imported successfully")
    except ImportError as e:
        print(f"❌ NumPy import failed: {e}")
        return False
    
    try:
        import scipy
        print(f"✅ SciPy {scipy.__version__} imported successfully")
    except ImportError as e:
        print(f"❌ SciPy import failed: {e}")
        return False
    
    try:
        import matplotlib
        print(f"✅ Matplotlib {matplotlib.__version__} imported successfully")
    except ImportError as e:
        print(f"❌ Matplotlib import failed: {e}")
        return False
    
    return True

def test_basic_functionality():
    """Test basic functionality of the packages"""
    print("\nTesting basic functionality...")
    
    import numpy as np
    import scipy.stats as stats
    import matplotlib.pyplot as plt
    
    # Test NumPy
    arr = np.array([1, 2, 3, 4, 5])
    print(f"✅ NumPy array: {arr}")
    print(f"✅ NumPy mean: {np.mean(arr)}")
    
    # Test SciPy
    mean, std = stats.norm.fit(arr)
    print(f"✅ SciPy stats - mean: {mean:.2f}, std: {std:.2f}")
    
    # Test Matplotlib (create a simple plot)
    plt.figure(figsize=(8, 6))
    plt.plot(arr, 'o-', label='Data')
    plt.title('Test Plot')
    plt.xlabel('Index')
    plt.ylabel('Value')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Save the plot (don't show in headless environment)
    plt.savefig('test_plot.png', dpi=150, bbox_inches='tight')
    plt.close()
    print("✅ Matplotlib plot created and saved as 'test_plot.png'")
    
    return True

def test_advanced_features():
    """Test more advanced features"""
    print("\nTesting advanced features...")
    
    import numpy as np
    import scipy.optimize as optimize
    import matplotlib.pyplot as plt
    
    # Test SciPy optimization
    def objective(x):
        return (x[0] - 1)**2 + (x[1] - 2)**2
    
    result = optimize.minimize(objective, [0, 0])
    print(f"✅ SciPy optimization result: {result.x}")
    
    # Test NumPy advanced features
    matrix = np.random.rand(3, 3)
    eigenvals = np.linalg.eigvals(matrix)
    print(f"✅ NumPy eigenvalues: {eigenvals}")
    
    return True

if __name__ == "__main__":
    print("🧪 Testing Scientific Packages in Binder")
    print("=" * 50)
    
    # Test imports
    if not test_imports():
        print("❌ Import tests failed!")
        sys.exit(1)
    
    # Test basic functionality
    if not test_basic_functionality():
        print("❌ Basic functionality tests failed!")
        sys.exit(1)
    
    # Test advanced features
    if not test_advanced_features():
        print("❌ Advanced feature tests failed!")
        sys.exit(1)
    
    print("\n🎉 All tests passed! Your scientific packages are working correctly.")
    print("\nYou can now use:")
    print("  - NumPy for numerical computing")
    print("  - SciPy for scientific computing")
    print("  - Matplotlib for plotting")
    print("  - And all other packages in your requirements.txt") 