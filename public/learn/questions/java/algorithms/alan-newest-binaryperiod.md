# Binary Period

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Bit Manipulation

*Source:* `alan/newest/binaryPeriod.java`

## Solution

```java
public class binaryPeriod {
	public static int binaryPeriod1(int N) {
		System.out.println("N " + N);

		String binaryString = Integer.toBinaryString(N);

		int lenghtInBits = binaryString.length();
		int mid = lenghtInBits / 2;
		int module = lenghtInBits % 2;

		N = N >> module;
		System.out.println("binary " + Integer.toBinaryString(N));

		return getBinaryPeriod(N, mid);
	}

	private static int getBinaryPeriod(int N, int mid) {
		System.out.println();
		for (int i = 0; i < mid - 1; i++) {
			int higherSide = N >> (mid + i);
			System.out.println("higherSide " + Integer.toBinaryString(higherSide));

			int numberToMask = N >> 2 * i;
			System.out.println("number to mask " + Integer.toBinaryString(numberToMask));
			int lowerMask = ~((~0) << (mid - i));
			System.out.println("lowerMask " + Integer.toBinaryString(lowerMask));

			int lowerSide = numberToMask & lowerMask;
			System.out.println("lowerSide " + Integer.toBinaryString(lowerSide));

			System.out.println();
			if (higherSide == lowerSide) {
				return mid - i;
			}
		}
		return -1;
	}

	public static void printBinaryPeriod(int N) {
		System.out.println();
		System.out.println("Binary period of " + N + " is: " + binaryPeriod1(N));
	}

	public static void main(String[] args) {
		printBinaryPeriod(955);
//		printBinaryPeriod(102);
	}
}
```
