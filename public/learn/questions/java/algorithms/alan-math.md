# Math

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Math / Number Theory

*Source:* `alan/math.java`

## Solution

```java
public class math {
	public static long fibonacci(long n) {
		if (n == 0) {
			return 0;
		}
		if (n == 1) {
			return 1;
		} else {
			return fibonacci(n - 1) + fibonacci(n - 2);
		}
	}

	public static void main(String[] args) {
		int NUMBERS = 150;
		for (int i = 0; i < NUMBERS; i++) {
			System.out.print(fibonacci(i) + " ");
		}
	}
}
```
