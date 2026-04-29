# Circular Prime

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Dynamic Programming

*Source:* `alan/newest/CircularPrime.java`

## Solution

```java
import java.util.ArrayList;

public class CircularPrime {
	long divisiones1 = 0;
	long divisiones2 = 0;

	public boolean isPrime(int number) {
		if (number == 2) {
			return true;
		}

		int sqrt = (int) Math.sqrt(number) + 1;

		for (int i = 2; i <= sqrt; i++) {
			divisiones1++;
			if ((number % i) == 0) {
				return false;
			}
		}
		return true;
	}

	// it would be better to divide for already calculated primes. Memoization
	// technique
	private boolean isPrimeMemoization(int number, ArrayList<Integer> primeNumbers) {
		int sqrt = (int) Math.sqrt(number) + 1;

		int size = primeNumbers.size();
		for (int i = 2; i <= size && i <= sqrt; i++) {
			divisiones2++;
			if ((number % i) == 0) {
				return false;
			}
		}
		primeNumbers.add(number);
		return true;
	}

	public int countPrimes(int number) {
		int count = 0;

		for (int i = 2; i <= number; i++) {
			if (isPrime(i)) {
				// System.out.println(i + " is prime.");
				count++;
			}
		}

		return count;
	}

	public int countPrimesMemoization(int number) {
		ArrayList<Integer> primeNumbers = new ArrayList<Integer>();

		for (int i = 2; i <= number; i++) {
			if (isPrimeMemoization(i, primeNumbers)) {
				// primeNumbers.add(0, i);
				// System.out.println(i + " is prime2.");
			}
		}

		return primeNumbers.size();
	}

	public int countCircularPrimes(int number) {
		int count = 0;

		number: for (int i = 2; i <= number; i++) {
			if (isPrime(i)) {
				ArrayList<Integer> rotations = getRotations(i);
				for (int rotation : rotations) {
					if (!isPrime(rotation)) {
						continue number;
					}
				}
				count++;
				// System.out.println(i + "is a circular prime");
			}
		}

		return count;
	}

	private ArrayList<Integer> getRotations(int number) {
		String sNumber = String.valueOf(number);
		int length = sNumber.length();
		int rotations = length - 1;

		ArrayList<Integer> rotationNumbers = new ArrayList<Integer>();
		for (int i = 1; i <= rotations; i++) {
			String firsPart = sNumber.substring(i, length);
			String secondPart = sNumber.substring(0, i);
			String sCircularPrime = firsPart + secondPart;
			int rotationNumber = Integer.parseInt(sCircularPrime);
			// avoid calculate primality test to the rotation numbers equal to
			// the original number
			if (rotationNumber != number) {
				rotationNumbers.add(rotationNumber);
			}
		}

		return rotationNumbers;
	}

	public static void main(String[] args) {
		CircularPrime p = new CircularPrime();
		// long f = 10.000L;
		// Double d = 10.000.000;
		int MAX_NUMBER = 100;
		// System.out.println("Amount of primes: " + p.countPrimes(MAX_NUMBER));
		// System.out.println(p.divisiones1);
		//
		// System.out.println("Amount of primes: " +
		// p.countPrimes2(MAX_NUMBER));
		// System.out.println(p.divisiones2);

		System.out.println("Amount of circular primes: " + p.countCircularPrimes(MAX_NUMBER));

		p.getRotations(197);

		// 67818901
		// 67818899

		// boolean prime = p.isPrime(7056);
		// System.out.println(prime);
	}

}
```
