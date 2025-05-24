import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

const App = () => {
  const [categories, setCategories] = useState([
    { name: 'Bilim Kurgu', api: 'https://openlibrary.org/subjects/science_fiction.json?limit=50' },
    { name: 'Fantastik', api: 'https://openlibrary.org/subjects/fantasy.json?limit=50' },
    { name: 'Korku', api: 'https://openlibrary.org/subjects/horror.json?limit=50' },
    { name: 'Romantik', api: 'https://openlibrary.org/subjects/romance.json?limit=50' },
    { name: 'Dünya Klasikleri', api: 'https://openlibrary.org/subjects/classic.json?limit=50' },
  ]);

  const [books, setBooks] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    categories.forEach((category) => {
      fetch(category.api)
        .then((response) => response.json())
        .then((data) => {
          setBooks((prevBooks) => ({ ...prevBooks, [category.name]: data.works }));
        })
        .catch((error) => console.error('API Hatası:', error));
    });
  }, []);

  const handleLogin = () => {
    if (username === 'admin' && password === '12345') {
      setLoggedIn(true);
    } else {
      Alert.alert('Hata', 'Kullanıcı adı veya şifre yanlış.');
    }
  };

  const handleSignUp = () => {
    if (name && email && password) {
      setLoggedIn(true);
      setShowSignUp(false);
    } else {
      Alert.alert('Hata', 'Tüm alanları doldurduğunuzdan emin olun.');
    }
  };

  const addToFavorites = (book) => {
    setFavoriteBooks((prevFavorites) => [...prevFavorites, book]);
  };

  const addToRead = (book) => {
    setReadBooks((prevReadBooks) => [...prevReadBooks, book]);
  };

  const filteredBooks = (categoryBooks) => {
    return categoryBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <Image
            source={{ uri: 'https://img.icons8.com/clouds/200/000000/book.png' }} // Kitap ikonu görseli
            style={styles.loginImage}
          />
          <Text style={styles.welcomeText}>BookApp uygulamasına hoş geldiniz, lütfen giriş yapınız</Text>
          {!showSignUp ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#ddd"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#ddd"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSignUp(true)}>
                <Text style={styles.signupText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Ad Soyad"
                placeholderTextColor="#ddd"
                value={name}
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor="#ddd"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#ddd"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                <Text style={styles.loginButtonText}>Kayıt Ol</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowSignUp(false)}>
                <Text style={styles.signupText}>Zaten hesabınız var mı? Giriş Yapın</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TextInput
              style={styles.input}
              placeholder="Kitap Ara"
              placeholderTextColor="#ddd"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          <ScrollView>
            <View style={styles.tabContainer}>
              <TouchableOpacity style={styles.tab} onPress={() => setSelectedBook(null)}>
                <Text style={styles.tabText}>Kitaplar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => setSelectedBook('favorites')}>
                <Text style={styles.tabText}>Favoriler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab} onPress={() => setSelectedBook('read')}>
                <Text style={styles.tabText}>Okuduğum Kitaplar</Text>
              </TouchableOpacity>
            </View>
            {selectedBook && selectedBook !== 'favorites' && selectedBook !== 'read' ? (
              <View style={styles.detailContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setSelectedBook(null)}
                >
                  <Text style={styles.backButtonText}>← Geri Dön</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{selectedBook.title}</Text>
                <Image
                  source={{
                    uri: `https://covers.openlibrary.org/b/id/${selectedBook.cover_id}-L.jpg`,
                  }}
                  style={styles.bookImageLarge}
                />
                <Text style={styles.author}>Yazar: {selectedBook.authors?.[0]?.name || 'Bilinmiyor'}</Text>
                <Text style={styles.description}>Kısa Açıklama: {selectedBook.subject?.join(', ') || 'Bilgi yok'}</Text>
                <Text style={styles.description}>Özet: {selectedBook.description || 'Özet bulunamadı.'}</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToFavorites(selectedBook)}
                >
                  <Text style={styles.addButtonText}>Favorilere Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToRead(selectedBook)}
                >
                  <Text style={styles.addButtonText}>Okuduğum Kitaplara Ekle</Text>
                </TouchableOpacity>
              </View>
            ) : selectedBook === 'favorites' ? (
              <View style={styles.favoriteContainer}>
                <Text style={styles.title}>Favoriler</Text>
                {favoriteBooks.length > 0 ? (
                  favoriteBooks.map((book, index) => (
                    <View key={index} style={styles.bookItem}>
                      <Image
                        source={{
                          uri: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
                        }}
                        style={styles.bookImage}
                      />
                      <Text style={styles.bookTitle}>{book.title}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.bookTitle}>Henüz favori kitap eklemediniz.</Text>
                )}
              </View>
            ) : selectedBook === 'read' ? (
              <View style={styles.readContainer}>
                <Text style={styles.title}>Okuduğum Kitaplar</Text>
                {readBooks.length > 0 ? (
                  readBooks.map((book, index) => (
                    <View key={index} style={styles.bookItem}>
                      <Image
                        source={{
                          uri: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
                        }}
                        style={styles.bookImage}
                      />
                      <Text style={styles.bookTitle}>{book.title}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.bookTitle}>Henüz okuduğunuz kitap yok.</Text>
                )}
              </View>
            ) : (
              <ScrollView>
                {categories.map((category) => (
                  <View key={category.name} style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{category.name}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {filteredBooks(books[category.name] || []).map((book) => (
                        <TouchableOpacity
                          key={book.key}
                          style={styles.bookItem}
                          onPress={() => setSelectedBook(book)}
                        >
                          <Image
                            source={{
                              uri: `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`,
                            }}
                            style={styles.bookImage}
                          />
                          <Text style={styles.bookTitle}>{book.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ))}
              </ScrollView>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B0082',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  loginImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#FFD700',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    width: '100%',
  },
  loginButton: {
    padding: 12,
    backgroundColor: '#6A0DAD',
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  signupText: {
    color: '#ddd',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    padding: 16,
    backgroundColor: '#6A0DAD',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 8,
    backgroundColor: '#6A0DAD',
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    padding: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bookItem: {
    marginRight: 8,
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  bookTitle: {
    width: 100,
    textAlign: 'center',
    color: '#fff',
    marginTop: 4,
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  bookImageLarge: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#ddd',
    marginBottom: 16,
  },
  author: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#6A0DAD',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  addButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#6A0DAD',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  favoriteContainer: {
    padding: 16,
  },
  readContainer: {
    padding: 16,
  },
});

export default App;
