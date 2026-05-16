from django import forms
from .models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'author', 'content']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['title'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Post title'})
        self.fields['author'].widget.attrs.update({'class': 'form-control', 'placeholder': 'Your name'})
        self.fields['content'].widget = forms.Textarea(attrs={
            'class': 'form-control',
            'rows': 10,
            'placeholder': 'Write your post content here…',
        })

    def clean_title(self):
        title = self.cleaned_data.get('title', '').strip()
        if not title:
            raise forms.ValidationError('Title cannot be empty.')
        return title
