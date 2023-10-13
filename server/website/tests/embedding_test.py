from django.test import TestCase
from ephae.search import searchInit, zip_unflatten
from sentence_transformers import SentenceTransformer
from django.conf import settings
import numpy as np
from tqdm import tqdm
from website.models import common, BigPatent

import torch


##################################################
# Validate Embeddings
def validate(embedding_path, embedding_ixs_path, num_rows, emb_dim, iterations=100 ):
    print('Validating embedding step')

    #model_name = 'all-mpnet-base-v2'
    model = SentenceTransformer(settings.MODEL_PATH)

    embeddings = np.memmap(embedding_path, dtype='float32', mode='r', shape=(num_rows, emb_dim))
    pg_idxs = np.memmap(embedding_ixs_path, dtype=np.int32, mode='r', shape=(num_rows,))

    print( 'Checking that saved embeddings are equivalent to a re-embedding of text from the DB, and that it is dissimilar from random text.')

    random_text = 'Once this text is embedded, it should be quite dissimilar to any of the tested embeddings.'
    random_embedding = model.encode([random_text])[0]

    for i in tqdm(range(iterations)):
        pg_idx = pg_idxs[i]

        saved_embedding = embeddings[i]

        abstract = str(BigPatent.getById(pg_idx).abstract)
        actual_embedding = torch.tensor(
            model.encode([abstract])[0])

        assert saved_embedding.shape == (768,)
        assert actual_embedding.shape == (768,)

        # Assert that it was embedded and saved properly
        sim = torch.cosine_similarity(
            torch.tensor(saved_embedding),
            torch.tensor(actual_embedding),
            dim=0
        )
        assert sim.item() > 0.999

        # Assert that this abstract is different from `random_text`
        sim = torch.cosine_similarity(
            torch.tensor(saved_embedding),
            torch.tensor(random_embedding),
            dim=0
        )
        assert sim.item() < 0.3
        print('Embeddings validated as expected')


# Create your tests here.
class EmbeddingTest(TestCase):
    @classmethod
    def setUpClass(cls):
        pass

    def setUp(self):
        pass

    def test_embedding(self):
        rows = settings.FAISS_NUM_ROWS
        dim = settings.FAISS_EMB_DIM

        embedding_path = settings.FAISS_EMBEDDINGS_PATH.format(num_rows=rows, emb_dim=dim)
        embedding_ixs_path = settings.FAISS_EMBEDDINGS_PG_IXS_PATH.format(num_rows=rows, emb_dim=dim)

        validate(embedding_path, embedding_ixs_path, rows, dim )
