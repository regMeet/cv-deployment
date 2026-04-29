# Telegram

**Origin:** Telegram &nbsp;|&nbsp; **Topics:** Strings

*Source:* `telegram/telegram.java`

## Solution

```java
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

public class telegram {

	public static void main(String[] args) {
		

		String urlString = "https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s";

		String apiToken = "1678977599:AAGAQOzbLdkJ_RTMAqZ8JpqNAQpms5KGqgc";
		String chatId = "sendMessageBot";
		String text = "Hello world!";

		urlString = String.format(urlString, apiToken, chatId, text);

		URL url;
		try {
			url = new URL(urlString);

			URLConnection conn = url.openConnection();

			StringBuilder sb = new StringBuilder();
			InputStream is = new BufferedInputStream(conn.getInputStream());
			BufferedReader br = new BufferedReader(new InputStreamReader(is));
			String inputLine = "";
			while ((inputLine = br.readLine()) != null) {
				sb.append(inputLine);
			}
			String response = sb.toString();
			// Do what you want with response
			System.out.println(response);
		} catch (IOException e) {
			System.out.println("IOException");
			e.printStackTrace();
		}
	}

}
```
