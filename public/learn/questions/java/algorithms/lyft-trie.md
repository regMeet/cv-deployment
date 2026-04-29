# Trie

**Origin:** Lyft &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `lyft/Trie.java`

## Problem

count number of words starting with str
@param str
@return

## Solution

```java
import java.util.*;
import java.util.stream.Collectors;

class HashedTrie {
    private static class TrieNode {
        private Map<Character, TrieNode> children;
        boolean isLeafNode;
        int count;
        int priority;

        public TrieNode() {
            children = new HashMap<>();
            count = 0;
        }

        public TrieNode getChild(char ch) {
            return children.get(ch);
        }

        public TrieNode setChild(char ch) {
            return children.put(ch, new TrieNode());
        }

        public boolean isLeafNode() {
            return isLeafNode;
        }

        public void setLeafNode(boolean isLeafNode) {
            this.isLeafNode = isLeafNode;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public void setPriority(int priority) {
            this.priority = priority;
        }

        private void findLeafs(ArrayList<MatchWord> result, String prefix) {
            if (this.isLeafNode) {
                MatchWord m = new MatchWord(prefix, this.priority);
                result.add(m);
            }

            for(Map.Entry<Character, TrieNode> entry : children.entrySet()) {
                Character key = entry.getKey();
                TrieNode child = entry.getValue();
                child.findLeafs(result, prefix + key);
            }
        }
    }

    private TrieNode root;
    private int priority = 0;

    public HashedTrie() {
        root = new TrieNode();
    }

    public boolean add(String str) {
        TrieNode head = root;
        for(char ch : str.toCharArray()){
            if(head.getChild(ch) == null){
                head.setChild(ch);
            }
            head = head.getChild(ch);
        }
        if(head.isLeafNode()){
            return false;
        }
        head.setLeafNode(true);
        head.setPriority(++priority);
        return true;
    }

    public boolean find(String str) {
        TrieNode head = root;
        for(char ch : str.toCharArray()){
            head = head.getChild(ch);
            if(head == null){
                return false;
            }
        }
        return head.isLeafNode();
    }

    /**
     * count number of words starting with str
     * @param str
     * @return
     */
    public boolean prefix(String str) {
        TrieNode head = root;
        for(char ch : str.toCharArray()){
            head = head.getChild(ch);
            if(head == null){
                return false;
            }
        }
        return true;
    }

    public List<MatchWord> getWordsWithPrefix(String str) {
        return getWordsWithPrefix(str, 5);
    }

    public List<MatchWord> getWordsWithPrefix(String str, int limit) {
        ArrayList<MatchWord> result = new ArrayList<>();

        TrieNode head = root;
        for(char ch : str.toCharArray()){
            head = head.getChild(ch);
            if(head == null){
                return result;
            }
        }

        head.findLeafs(result, str);
        Collections.sort(result);

        return result.stream().limit(limit).collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<String> input = Arrays.asList("14", "4", "art", "zone", "zip", "arts", "date", "z", "day",
                "articles", "data", "catch", "zoom", "article", "articulate", "articulation", "catc", "art", "da", "z");

        int dictionaryWordsSize = Integer.valueOf(input.get(0));
        int autocompleteWordsSize = Integer.valueOf(input.get(1));

        List<String> autocompleteWords = new ArrayList<>();

        HashedTrie trie = new HashedTrie();
        for (int i = 0; i < dictionaryWordsSize; i++) {
            String dictionaryWord = input.get(i + 2);
            System.out.println("Adding word: " + dictionaryWord);
            trie.add(dictionaryWord);
        }

        for (int i = 0; i < autocompleteWordsSize; i++) {
            String autocompleteWord = input.get(i + 2 + dictionaryWordsSize);
            System.out.println("looking for word: " + autocompleteWord);
            autocompleteWords.add(autocompleteWord);
        }

        printMatchingWords(trie, autocompleteWords);
    }

    public static void printMatchingWords(HashedTrie trie, List<String> words) {
        for (String word : words) {
            List<MatchWord> matchWords = trie.getWordsWithPrefix(word);
            System.out.println(word + ":");

            for (MatchWord m : matchWords) {
                System.out.println(m.getMatchingWord() + " (" + m.getPriority() + ")");
            }
            System.out.println();
        }
    }
}
```
