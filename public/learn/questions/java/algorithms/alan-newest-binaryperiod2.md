# Binary Period 2

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Bit Manipulation

*Source:* `alan/newest/binaryPeriod2.java`

## Solution

```java
public class binaryPeriod2 {
	public static int solution(int N) {
		String binaryRepresentation = Integer.toBinaryString(N);

		int length = binaryRepresentation.length();
		int mid = length / 2;
		// int module = length % 2;
		// N = N >> module;

		int countPeriod = 0;
		int finalPeriod = -1;

		String testPeriod;
		for (int i = 1; i <= mid; i++) {
			testPeriod = binaryRepresentation.substring(0, i);
			countPeriod = getPeriod(testPeriod, binaryRepresentation);

			if (countPeriod > 0) {

				if (finalPeriod == -1) {
					finalPeriod = countPeriod;
				} else if (countPeriod < finalPeriod) {
					finalPeriod = countPeriod;
				}
			}
		}
		return finalPeriod;
	}

	public static int getPeriod(String period, String word) {
		int index = 0;
		for (int i = 0; i < word.length(); i++) {
			if (period.charAt(index) == word.charAt(i)) {
				if (index + 1 == period.length()) {
					index = 0;
				} else {
					index++;
				}
			} else {
				return -1;
			}
		}
		return period.length();
	}

	public static void printBinaryPeriod(int N) {
		System.out.println("Binary period of " + N + " is: " + solution(N));
	}

	public static void main(String[] args) {
		printBinaryPeriod(955);
		printBinaryPeriod(102);
	}

}
```
